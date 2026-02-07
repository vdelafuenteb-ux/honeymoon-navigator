import { useState, useCallback } from 'react';
import { TripEvent, TripCountry } from '@/types/trip';
import { tripItinerary as initialItinerary } from '@/data/mockItinerary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ParsedReceiptData {
  title?: string;
  type?: string;
  location?: string;
  datetime_start?: string;
  datetime_end?: string;
  cost?: number;
  currency?: string;
  confirmation_code?: string;
  notes?: string;
}

const PARSE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-receipt`;

export const useItinerary = () => {
  const [itinerary, setItinerary] = useState<TripCountry[]>(initialItinerary);

  const updateEvent = useCallback((eventId: string, updates: Partial<TripEvent>) => {
    setItinerary(prev =>
      prev.map(country => ({
        ...country,
        days: country.days.map(day => ({
          ...day,
          events: day.events.map(event =>
            event.id === eventId ? { ...event, ...updates } : event
          ),
        })),
      }))
    );
  }, []);

  const addEvent = useCallback((eventData: Partial<TripEvent> & { country: string }) => {
    const newEvent: TripEvent = {
      id: `chat-${Date.now()}`,
      type: (eventData.type as TripEvent['type']) || 'activity',
      status: (eventData.status as TripEvent['status']) || 'draft',
      title: eventData.title || 'Nuevo evento',
      location: eventData.location || '',
      datetime_start: eventData.datetime_start || new Date().toISOString(),
      datetime_end: eventData.datetime_end,
      notes: eventData.notes || '',
      source: 'user_chat',
      cost_estimated: eventData.cost_estimated,
      currency: eventData.currency || 'USD',
    };

    setItinerary(prev => {
      const countryIdx = prev.findIndex(c => c.country === eventData.country);
      if (countryIdx === -1) return prev;

      const dateStr = newEvent.datetime_start.slice(0, 10);
      const updated = [...prev];
      const country = { ...updated[countryIdx], days: [...updated[countryIdx].days] };

      const dayIdx = country.days.findIndex(d => d.date === dateStr);
      if (dayIdx !== -1) {
        country.days[dayIdx] = { ...country.days[dayIdx], events: [...country.days[dayIdx].events, newEvent] };
      } else {
        country.days = [...country.days, { date: dateStr, events: [newEvent] }].sort((a, b) => a.date.localeCompare(b.date));
      }

      updated[countryIdx] = country;
      return updated;
    });
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: 'draft' | 'confirmed', attachmentUrl?: string) => {
    updateEvent(eventId, { status, attachment_url: attachmentUrl });
  }, [updateEvent]);

  const parseReceipt = useCallback(async (imageUrl: string, fileType: string): Promise<ParsedReceiptData | null> => {
    try {
      const resp = await fetch(PARSE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ imageUrl, fileType }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) toast.error('Demasiadas solicitudes de IA, espera un momento');
        else if (resp.status === 402) toast.error('Créditos de IA agotados');
        else toast.error(err.error || 'Error al analizar el documento');
        return null;
      }

      const result = await resp.json();
      return result.data || null;
    } catch (err) {
      console.error('Parse receipt error:', err);
      toast.error('Error al analizar el comprobante');
      return null;
    }
  }, []);

  const uploadReceipt = useCallback(async (eventId: string, file: File) => {
    try {
      const ext = file.name.split('.').pop();
      const path = `${eventId}/${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(path, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      // Immediately confirm the event with the attachment
      updateEventStatus(eventId, 'confirmed', publicUrl);
      toast.success('✨ Comprobante subido — analizando con IA...');

      // Parse the receipt with AI in parallel
      const parsed = await parseReceipt(publicUrl, file.type);

      if (parsed) {
        // Apply extracted data to the event
        const updates: Partial<TripEvent> = {
          status: 'confirmed',
          attachment_url: publicUrl,
          source: 'file_parsed',
        };
        if (parsed.datetime_start) updates.datetime_start = parsed.datetime_start;
        if (parsed.datetime_end) updates.datetime_end = parsed.datetime_end;
        if (parsed.cost) updates.cost_actual = parsed.cost;
        if (parsed.currency) updates.currency = parsed.currency;
        if (parsed.location) updates.location = parsed.location;
        if (parsed.title) updates.title = parsed.title;
        if (parsed.notes) {
          updates.notes = parsed.confirmation_code
            ? `Ref: ${parsed.confirmation_code}. ${parsed.notes}`
            : parsed.notes;
        } else if (parsed.confirmation_code) {
          updates.notes = `Ref: ${parsed.confirmation_code}`;
        }

        updateEvent(eventId, updates);
        toast.success('🎉 IA extrajo los datos del comprobante correctamente');
      }

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Error al subir el comprobante');
      return null;
    }
  }, [updateEventStatus, updateEvent, parseReceipt]);

  return { itinerary, updateEventStatus, updateEvent, uploadReceipt, addEvent };
};
