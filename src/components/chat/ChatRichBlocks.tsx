import { motion } from 'framer-motion';
import { Plane, Hotel, Utensils, MapPin, Train, Clock, CheckCircle2, Plus, Sparkles, Heart } from 'lucide-react';
import { TripEvent, EventType } from '@/types/trip';

// ─── Type icon helper ────────────────────────────
const typeIcons: Record<string, typeof Plane> = {
  flight: Plane, hotel: Hotel, food: Utensils, activity: MapPin, transport: Train,
};
const typeLabels: Record<string, string> = {
  flight: 'Vuelo', hotel: 'Hotel', food: 'Restaurante', activity: 'Actividad', transport: 'Transporte',
};
const typeColors: Record<string, string> = {
  flight: 'bg-lavender-light text-lavender',
  hotel: 'bg-rose-subtle text-primary',
  food: 'bg-gold-subtle text-accent',
  activity: 'bg-status-confirmed-bg text-status-confirmed',
  transport: 'bg-lavender-light text-lavender',
};

// ─── Created Event Card ──────────────────────────
export interface CreatedEventData {
  type: EventType;
  title: string;
  location: string;
  country: string;
  datetime_start: string;
  datetime_end?: string;
  notes?: string;
  cost_estimated?: number;
  currency?: string;
}

export const CreatedEventBlock = ({ event, index = 0 }: { event: CreatedEventData; index?: number }) => {
  const Icon = typeIcons[event.type] || MapPin;
  const colorClass = typeColors[event.type] || 'bg-muted text-muted-foreground';

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
    } catch { return ''; }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', bounce: 0.3 }}
      className="bg-card rounded-2xl border border-border p-3.5 shadow-[var(--shadow-soft)] space-y-2"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring', bounce: 0.5 }}
          className="shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-status-confirmed-bg flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-status-confirmed" />
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{formatDate(event.datetime_start)}</span>
        <span>·</span>
        <span>{formatTime(event.datetime_start)}</span>
        {event.datetime_end && (
          <>
            <span>→</span>
            <span>{formatTime(event.datetime_end)}</span>
          </>
        )}
      </div>

      {(event.cost_estimated || event.notes) && (
        <div className="flex items-center gap-2 text-[11px]">
          {event.cost_estimated && (
            <span className="bg-gold-subtle text-accent px-2 py-0.5 rounded-full font-semibold">
              ~${event.cost_estimated.toLocaleString()} {event.currency || 'USD'}
            </span>
          )}
          {event.notes && (
            <span className="text-muted-foreground italic truncate">{event.notes}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─── Timeline Block ──────────────────────────────
export interface TimelineData {
  date: string;
  country?: string;
}

export const TimelineBlock = ({ data, events }: { data: TimelineData; events: TripEvent[] }) => {
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso + 'T12:00:00');
      return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch { return iso; }
  };

  const dayEvents = events.filter(e => e.datetime_start.startsWith(data.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full gradient-romantic flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <p className="text-xs font-semibold text-foreground capitalize">{formatDate(data.date)}</p>
      </div>

      {dayEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-dashed border-border p-4 text-center"
        >
          <Heart className="w-5 h-5 text-rose-light mx-auto mb-1.5" />
          <p className="text-xs text-muted-foreground italic">Día libre — perfecto para improvisar 💕</p>
        </motion.div>
      ) : (
        <div className="relative pl-5 space-y-2">
          {/* Timeline line */}
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

          {dayEvents.map((event, i) => {
            const Icon = typeIcons[event.type] || MapPin;
            const colorClass = typeColors[event.type] || 'bg-muted text-muted-foreground';
            const time = (() => {
              try { return new Date(event.datetime_start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }); }
              catch { return ''; }
            })();

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i, type: 'spring', bounce: 0.2 }}
                className="relative"
              >
                {/* Dot on timeline */}
                <div className="absolute -left-5 top-3 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background z-10" />

                <div className="bg-card rounded-xl border border-border p-2.5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${colorClass}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground">{time} · {event.location}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      event.status === 'confirmed' ? 'status-confirmed' : 'status-draft'
                    }`}>
                      {event.status === 'confirmed' ? '✓' : '⏳'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// ─── Suggestion Cards ────────────────────────────
export interface SuggestionItem {
  title: string;
  type: string;
  location: string;
  description: string;
  cost_estimated?: number;
  currency?: string;
  emoji: string;
  country: string;
  datetime_start: string;
}

export const SuggestionCards = ({
  suggestions,
  onAccept,
}: {
  suggestions: SuggestionItem[];
  onAccept?: (suggestion: SuggestionItem) => void;
}) => {
  return (
    <div className="space-y-2">
      {suggestions.map((s, i) => {
        const Icon = typeIcons[s.type] || MapPin;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 * i, type: 'spring', bounce: 0.25 }}
            className="bg-card rounded-2xl border border-border p-3 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{s.location}</span>
                  {s.cost_estimated && (
                    <span className="bg-gold-subtle text-accent px-1.5 py-0.5 rounded-full font-semibold ml-auto">
                      ~${s.cost_estimated} {s.currency || 'USD'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {onAccept && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAccept(s)}
                className="mt-2 w-full gradient-romantic text-primary-foreground py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                Agregar al itinerario
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Quick Actions ───────────────────────────────
export const QuickActions = ({ onAction }: { onAction: (text: string) => void }) => {
  const actions = [
    { label: '¿Qué hacemos mañana?', emoji: '📅' },
    { label: 'Sugiere una cena romántica', emoji: '🍽️' },
    { label: 'Resumen del viaje', emoji: '✨' },
    { label: 'Agrega una actividad', emoji: '🎯' },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((a, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 * i }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction(a.label)}
          className="bg-card border border-border rounded-full px-3 py-1.5 text-[11px] text-foreground font-medium flex items-center gap-1.5 shadow-[var(--shadow-soft)] hover:border-rose-light/50 transition-colors"
        >
          <span>{a.emoji}</span>
          {a.label}
        </motion.button>
      ))}
    </div>
  );
};
