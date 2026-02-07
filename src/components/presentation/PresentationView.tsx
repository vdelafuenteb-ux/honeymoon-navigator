import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripCountry } from '@/types/trip';
import { tripStats } from '@/data/mockItinerary';
import CountdownHero from './CountdownHero';
import DestinationCard from './DestinationCard';
import WishlistSection from './WishlistSection';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface PresentationViewProps {
  itinerary: TripCountry[];
  onBack: () => void;
}

const PresentationView = ({ itinerary, onBack }: PresentationViewProps) => {
  const [entered, setEntered] = useState(false);

  const allEvents = useMemo(
    () => itinerary.flatMap(c => c.days.flatMap(d => d.events)),
    [itinerary]
  );
  const confirmed = allEvents.filter(e => e.status === 'confirmed');
  const drafts = allEvents.filter(e => e.status === 'draft');
  const percent = allEvents.length > 0 ? Math.round((confirmed.length / allEvents.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Back button - always visible */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onBack}
        className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-md p-2.5 rounded-full border border-border shadow-[var(--shadow-soft)] hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-4 h-4 text-foreground" />
      </motion.button>

      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <CountdownHero
              daysRemaining={tripStats.daysRemaining}
              percentConfirmed={percent}
              totalEvents={allEvents.length}
              confirmedEvents={confirmed.length}
              onEnter={() => setEntered(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section header */}
            <div className="pt-16 pb-6 text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-2">
                  Nuestros destinos
                </p>
                <h2 className="text-3xl font-display font-bold text-foreground italic">
                  6 países, un solo{' '}
                  <span className="bg-gradient-to-r from-rose to-gold bg-clip-text text-transparent">amor</span>
                </h2>
              </motion.div>
            </div>

            {/* Destination cards */}
            <div className="pb-4">
              {itinerary.map((country, i) => (
                <DestinationCard key={country.country} country={country} index={i} />
              ))}
            </div>

            {/* Wishlist section */}
            <WishlistSection draftEvents={drafts} />

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12 px-4"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-rose-glow fill-current" />
                <Sparkles className="w-4 h-4 text-gold" />
                <Heart className="w-4 h-4 text-rose-glow fill-current" />
              </div>
              <p className="text-sm text-muted-foreground italic font-display text-lg">
                "El mundo es un libro, y quienes no viajan<br />solo leen una página"
              </p>
              <p className="text-xs text-muted-foreground mt-2">— San Agustín</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresentationView;
