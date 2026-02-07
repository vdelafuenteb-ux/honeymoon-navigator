import { Plane, Hotel, Utensils, MapPin, Train } from 'lucide-react';
import { EventType } from '@/types/trip';

export const eventTypeConfig: Record<EventType, { icon: typeof Plane; label: string; color: string }> = {
  flight: { icon: Plane, label: 'Vuelo', color: 'text-blue-500' },
  hotel: { icon: Hotel, label: 'Hotel', color: 'text-purple-500' },
  activity: { icon: MapPin, label: 'Actividad', color: 'text-emerald-500' },
  food: { icon: Utensils, label: 'Comida', color: 'text-orange-500' },
  transport: { icon: Train, label: 'Transporte', color: 'text-cyan-500' },
};
