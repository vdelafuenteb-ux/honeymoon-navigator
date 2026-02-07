import { motion, AnimatePresence } from 'framer-motion';
import { TripCountry } from '@/types/trip';
import { destinationHeroImages, destinationGuides, GuidePlace } from '@/data/destinationImages';
import { CheckCircle2, Clock, MapPin, Sparkles, ExternalLink, Camera, Utensils, Lightbulb, ChevronDown, Navigation } from 'lucide-react';
import { useState } from 'react';

interface DestinationCardProps {
  country: TripCountry;
  index: number;
}

const categoryConfig: Record<string, { icon: typeof MapPin; label: string; colorClass: string }> = {
  attraction: { icon: Sparkles, label: 'Atracción', colorClass: 'bg-lavender-light text-lavender' },
  food: { icon: Utensils, label: 'Restaurante', colorClass: 'bg-gold-subtle text-accent' },
  photo: { icon: Camera, label: 'Foto Spot', colorClass: 'bg-rose-subtle text-primary' },
  tip: { icon: Lightbulb, label: 'Tip', colorClass: 'bg-status-confirmed-bg text-status-confirmed' },
};

const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const PlaceCard = ({ place, index }: { place: GuidePlace; index: number }) => {
  const config = categoryConfig[place.category] || categoryConfig.attraction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 * index, type: 'spring', bounce: 0.2 }}
      className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-3 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-2.5">
        <span className="text-xl mt-0.5">{place.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-semibold text-foreground truncate">{place.name}</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${config.colorClass}`}>
              {config.label}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{place.description}</p>
          {place.tip && (
            <div className="mt-1.5 flex items-start gap-1.5 bg-gold-subtle/50 rounded-lg px-2 py-1.5">
              <Lightbulb className="w-3 h-3 text-accent mt-0.5 shrink-0" />
              <p className="text-[10px] text-accent italic leading-relaxed">{place.tip}</p>
            </div>
          )}
          <a
            href={mapsUrl(place.mapsQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-primary font-medium hover:underline"
          >
            <Navigation className="w-2.5 h-2.5" />
            Ver en Google Maps
            <ExternalLink className="w-2 h-2" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const DestinationCard = ({ country, index }: DestinationCardProps) => {
  const heroImage = destinationHeroImages[country.country] || '';
  const guide = destinationGuides[country.country];
  const [showGuide, setShowGuide] = useState(false);

  const allEvents = country.days.flatMap(d => d.events);
  const confirmed = allEvents.filter(e => e.status === 'confirmed');
  const drafts = allEvents.filter(e => e.status === 'draft');
  const topConfirmed = confirmed.slice(0, 3);

  const attractions = guide?.places.filter(p => p.category === 'attraction') || [];
  const food = guide?.places.filter(p => p.category === 'food') || [];
  const photos = guide?.places.filter(p => p.category === 'photo') || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
      className="mx-4 mb-8"
    >
      {/* Hero image card */}
      <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)]" style={{ minHeight: '55vh' }}>
        <div className="absolute inset-0">
          <img src={heroImage} alt={country.country} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-end p-5 pb-6" style={{ minHeight: '55vh' }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 w-fit mb-2"
          >
            <span className="text-lg">{country.flag}</span>
            <span className="text-xs text-white/90 font-medium">{country.dateRange}</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-display font-bold text-white italic mb-1"
          >
            {country.country}
          </motion.h2>

          {guide && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/70 text-sm italic mb-4 max-w-xs"
            >
              {guide.tagline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              <CheckCircle2 className="w-3 h-3 text-white/90" />
              <span className="text-[10px] text-white/80 font-semibold">{confirmed.length} listos ✓</span>
            </div>
            {drafts.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">
                <Clock className="w-3 h-3 text-white/70" />
                <span className="text-[10px] text-white/70 font-semibold">{drafts.length} pendientes</span>
              </div>
            )}
          </motion.div>

          {topConfirmed.length > 0 && (
            <div className="space-y-1.5">
              {topConfirmed.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10"
                >
                  <CheckCircle2 className="w-3 h-3 text-white/80 shrink-0" />
                  <span className="text-[11px] text-white/85 truncate">{event.title}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Guide section — expandable */}
      {guide && (
        <div className="mt-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGuide(!showGuide)}
            className="w-full bg-card rounded-2xl border border-border p-3.5 flex items-center gap-3 shadow-[var(--shadow-soft)] hover:border-rose-light/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl gradient-romantic flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Guía de {country.country}</p>
              <p className="text-[10px] text-muted-foreground">{guide.places.length} lugares · Tips · Restaurantes · Fotos</p>
            </div>
            <motion.div animate={{ rotate: showGuide ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-4">
                  {/* Transport tip */}
                  <div className="bg-card rounded-2xl border border-border p-3 shadow-[var(--shadow-soft)]">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">🚀</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Cómo llegar</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{guide.transportTip}</p>
                      </div>
                    </div>
                  </div>

                  {/* Must try */}
                  <div className="bg-gold-subtle rounded-2xl border border-gold-light/30 p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">No se pierdan</p>
                        <p className="text-[11px] text-accent italic leading-relaxed">{guide.mustTry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attractions */}
                  {attractions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5 px-1">
                        <Sparkles className="w-3 h-3 text-lavender" /> Atracciones imperdibles
                      </p>
                      <div className="space-y-2">
                        {attractions.map((p, i) => <PlaceCard key={p.name} place={p} index={i} />)}
                      </div>
                    </div>
                  )}

                  {/* Restaurants */}
                  {food.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5 px-1">
                        <Utensils className="w-3 h-3 text-accent" /> Dónde comer
                      </p>
                      <div className="space-y-2">
                        {food.map((p, i) => <PlaceCard key={p.name} place={p} index={i} />)}
                      </div>
                    </div>
                  )}

                  {/* Photo spots */}
                  {photos.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5 px-1">
                        <Camera className="w-3 h-3 text-primary" /> Spots para fotos
                      </p>
                      <div className="space-y-2">
                        {photos.map((p, i) => <PlaceCard key={p.name} place={p} index={i} />)}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default DestinationCard;
