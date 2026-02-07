import { motion, AnimatePresence } from 'framer-motion';
import { TripCountry } from '@/types/trip';
import { CheckCircle2, Clock, MapPin, Navigation, ExternalLink, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useEventImage } from '@/hooks/useEventImage';
import { eventTypeConfig } from '@/lib/eventConfig';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface DestinationCardProps {
  country: TripCountry;
  index: number;
}

const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const DestinationCard = ({ country, index }: DestinationCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Generate AI image based on the country name
  const imagePrompt = `${country.country} iconic landmark, travel destination`;
  const { imageUrl: heroImage, loading: heroLoading } = useEventImage(imagePrompt);

  const allEvents = country.days.flatMap(d => d.events);
  const confirmed = allEvents.filter(e => e.status === 'confirmed');
  const drafts = allEvents.filter(e => e.status === 'draft');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
      className="mx-4 mb-8"
    >
      {/* Hero image */}
      <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)]" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0">
          {heroLoading ? (
            <div className="w-full h-full bg-gradient-to-br from-rose-subtle via-background to-gold-subtle flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-muted-foreground/30" />
              </motion.div>
            </div>
          ) : heroImage ? (
            <img src={heroImage} alt={country.country} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-subtle via-background to-gold-subtle" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        </div>

        <div className="relative z-10 flex flex-col justify-end p-6" style={{ minHeight: '60vh' }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 w-fit mb-3"
          >
            <span className="text-xl">{country.flag}</span>
            <span className="text-xs text-white/90 font-medium">{country.dateRange}</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-display font-bold text-white italic mb-3"
          >
            {country.country}
          </motion.h2>

          {/* Stats chips */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              <Calendar className="w-3 h-3 text-white/80" />
              <span className="text-[10px] text-white/80 font-semibold">{country.days.length} días</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              <CheckCircle2 className="w-3 h-3 text-white/80" />
              <span className="text-[10px] text-white/80 font-semibold">{confirmed.length} listos</span>
            </div>
            {drafts.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">
                <Clock className="w-3 h-3 text-white/60" />
                <span className="text-[10px] text-white/60 font-semibold">{drafts.length} pendientes</span>
              </div>
            )}
          </motion.div>

          {/* Top events preview */}
          {allEvents.slice(0, 3).map((event, i) => {
            const cfg = eventTypeConfig[event.type];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 mb-1.5"
              >
                <span className="text-sm">{cfg.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-white/90 font-medium truncate block">{event.title}</span>
                  <span className="text-[9px] text-white/50">{event.location}</span>
                </div>
                {event.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-[hsl(var(--status-confirmed))]/80 shrink-0" />}
              </motion.div>
            );
          })}
          {allEvents.length > 3 && (
            <p className="text-[10px] text-white/40 mt-1 text-center italic">
              +{allEvents.length - 3} más
            </p>
          )}
        </div>
      </div>

      {/* Day-by-day expandable section */}
      <div className="mt-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className="w-full bg-card rounded-2xl border border-border p-3.5 flex items-center gap-3 shadow-[var(--shadow-soft)] hover:border-rose-light/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl gradient-romantic flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Itinerario día a día</p>
            <p className="text-[10px] text-muted-foreground">{country.days.length} días · {allEvents.length} eventos planificados</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-4">
                {country.days.map((day) => (
                  <DaySlide key={day.date} date={day.date} events={day.events} countryName={country.country} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// A beautiful day card with event details
const DaySlide = ({ date, events, countryName }: { date: string; events: any[]; countryName: string }) => {
  const formatted = format(parseISO(date + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-soft)]"
    >
      <div className="bg-rose-subtle/50 px-4 py-2.5 border-b border-border">
        <p className="text-xs font-semibold text-foreground capitalize">{formatted}</p>
      </div>
      <div className="p-3 space-y-2">
        {events.map((event) => (
          <EventSlide key={event.id} event={event} />
        ))}
      </div>
    </motion.div>
  );
};

// Individual event with AI image and details
const EventSlide = ({ event }: { event: any }) => {
  const cfg = eventTypeConfig[event.type] || eventTypeConfig.activity;
  const { imageUrl, loading } = useEventImage(
    `${event.title} ${event.location}`,
    true
  );

  const timeStr = event.datetime_start
    ? format(parseISO(event.datetime_start), 'HH:mm')
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors"
    >
      {/* Image thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-3 h-3 text-muted-foreground/30" />
            </motion.div>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            {cfg.emoji}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
            {timeStr}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
            event.status === 'confirmed' ? 'status-confirmed' : 'status-draft'
          }`}>
            {event.status === 'confirmed' ? '✓ Listo' : '⏳ Pendiente'}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground truncate">{event.location}</p>
        </div>
        {event.notes && (
          <p className="text-[10px] text-muted-foreground/70 italic mt-0.5 truncate">
            {event.notes}
          </p>
        )}
        {event.location && (
          <a
            href={mapsUrl(event.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[9px] text-primary font-medium hover:underline"
          >
            <Navigation className="w-2 h-2" />
            Google Maps
            <ExternalLink className="w-2 h-2" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default DestinationCard;
