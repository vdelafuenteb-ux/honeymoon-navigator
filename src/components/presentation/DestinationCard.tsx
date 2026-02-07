import { motion } from 'framer-motion';
import { TripCountry } from '@/types/trip';
import { destinationImages, destinationTaglines } from '@/data/destinationImages';
import { CheckCircle2, Clock, Utensils, Plane, Hotel, MapPin, Sparkles } from 'lucide-react';

interface DestinationCardProps {
  country: TripCountry;
  index: number;
  onWish?: (eventId: string) => void;
}

const DestinationCard = ({ country, index, onWish }: DestinationCardProps) => {
  const imageUrl = destinationImages[country.country] || '';
  const tagline = destinationTaglines[country.country] || '';
  
  const allEvents = country.days.flatMap(d => d.events);
  const confirmed = allEvents.filter(e => e.status === 'confirmed');
  const drafts = allEvents.filter(e => e.status === 'draft');
  const topConfirmed = confirmed.slice(0, 3);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-3 h-3" />;
      case 'hotel': return <Hotel className="w-3 h-3" />;
      case 'food': return <Utensils className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
      className="relative rounded-3xl overflow-hidden mx-4 mb-6 shadow-[var(--shadow-elevated)]"
      style={{ minHeight: '70vh' }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={country.country}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-8" style={{ minHeight: '70vh' }}>
        {/* Country badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="mb-3"
        >
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <span className="text-lg">{country.flag}</span>
            <span className="text-xs text-white/90 font-medium">{country.dateRange}</span>
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
          className="text-4xl font-display font-bold text-white italic mb-2"
        >
          {country.country}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="text-white/70 text-sm italic mb-5 max-w-xs"
        >
          {tagline}
        </motion.p>

        {/* Confirmed highlights */}
        {topConfirmed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="space-y-2 mb-4"
          >
            {topConfirmed.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-status-confirmed shrink-0" />
                <span className="text-xs text-white/90 truncate">{event.title}</span>
                {typeIcon(event.type)}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 + index * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
            <CheckCircle2 className="w-3 h-3 text-white/90" />
            <span className="text-[10px] text-white/80 font-semibold">{confirmed.length} listos ✓</span>
          </div>
          {drafts.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">
              <Clock className="w-3 h-3 text-white/70" />
              <span className="text-[10px] text-white/70 font-semibold">{drafts.length} sueños por cumplir</span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
