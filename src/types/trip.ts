export type EventType = 'flight' | 'hotel' | 'activity' | 'food' | 'transport';
export type EventStatus = 'draft' | 'confirmed';
export type EventSource = 'user_chat' | 'file_parsed' | 'manual';

export interface TripEvent {
  id: string;
  type: EventType;
  status: EventStatus;
  title: string;
  location: string;
  attachment_url?: string;
  datetime_start: string;
  datetime_end?: string;
  notes: string;
  source: EventSource;
  cost_estimated?: number;
  cost_actual?: number;
  currency?: string;
}

export interface TripDay {
  date: string;
  events: TripEvent[];
}

export interface TripCountry {
  country: string;
  flag: string;
  dateRange: string;
  days: TripDay[];
  heroImage?: string;
}

export interface TripStats {
  totalDays: number;
  daysRemaining: number;
  budgetEstimated: number;
  budgetSpent: number;
  percentConfirmed: number;
  countriesCount: number;
  eventsCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
