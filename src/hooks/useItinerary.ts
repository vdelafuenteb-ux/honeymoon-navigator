import { useState, useCallback } from 'react';
import { TripEvent, TripCountry } from '@/types/trip';
import { tripItinerary as initialItinerary } from '@/data/mockItinerary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useItinerary = () => {
  const [itinerary, setItinerary] = useState<TripCountry[]>(initialItinerary);

  const updateEventStatus = useCallback((eventId: string, status: 'draft' | 'confirmed', attachmentUrl?: string) => {
    setItinerary(prev =>
      prev.map(country => ({
        ...country,
        days: country.days.map(day => ({
          ...day,
          events: day.events.map(event =>
            event.id === eventId
              ? { ...event, status, attachment_url: attachmentUrl || event.attachment_url }
              : event
          ),
        })),
      }))
    );
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

      updateEventStatus(eventId, 'confirmed', urlData.publicUrl);
      toast.success('¡Comprobante subido! Evento confirmado ✓');
      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Error al subir el comprobante');
      return null;
    }
  }, [updateEventStatus]);

  return { itinerary, updateEventStatus, uploadReceipt };
};
