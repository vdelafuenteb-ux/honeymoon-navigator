import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripEvent } from '@/types/trip';
import { eventTypeConfig } from '@/lib/eventConfig';
import { Lock, Unlock, Heart, Sparkles, ChevronDown, MapPin } from 'lucide-react';
import Confetti from './Confetti';

interface WishlistSectionProps {
  draftEvents: TripEvent[];
  onWish?: (eventId: string) => void;
}

const WishlistSection = ({ draftEvents, onWish }: WishlistSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [wishedIds, setWishedIds] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const handleWish = useCallback((eventId: string) => {
    setWishedIds(prev => {
      const next = new Set(prev);
      next.add(eventId);
      return next;
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
    onWish?.(eventId);
  }, [onWish]);

  if (draftEvents.length === 0) return null;

  return (
    <div className="px-4 py-8">
      <Confetti active={showConfetti} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 bg-gold-subtle px-4 py-2 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Sueños por desbloquear</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground italic">
          Lo que nos falta por vivir
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {draftEvents.length} experiencias esperando hacerse realidad 💫
        </p>
      </motion.div>

      <div className="space-y-3 max-w-lg mx-auto">
        {draftEvents.map((event, i) => {
          const config = eventTypeConfig[event.type];
          const Icon = config.icon;
          const isExpanded = expandedId === event.id;
          const isWished = wishedIds.has(event.id);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isWished
                  ? 'bg-rose-subtle border-rose-light/50 shadow-[var(--shadow-romantic)]'
                  : 'bg-card border-border shadow-[var(--shadow-soft)]'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className={`p-2.5 rounded-xl ${isWished ? 'bg-rose-light/20' : 'bg-muted'} transition-colors`}>
                  {isWished ? (
                    <Unlock className="w-4 h-4 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isWished ? 'text-primary' : 'text-foreground'}`}>
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {event.location}
                  </p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                        <span className="capitalize">{config.label}</span>
                        {event.cost_estimated && (
                          <span className="ml-auto font-semibold text-accent">
                            ~${event.cost_estimated.toLocaleString()} {event.currency}
                          </span>
                        )}
                      </div>
                      
                      {event.notes && (
                        <p className="text-xs text-muted-foreground italic bg-muted/50 rounded-xl p-3">
                          "{event.notes}"
                        </p>
                      )}

                      {!isWished && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWish(event.id);
                          }}
                          className="w-full gradient-romantic text-primary-foreground py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-[var(--shadow-romantic)]"
                        >
                          <Heart className="w-4 h-4" />
                          ¡Lo queremos!
                        </motion.button>
                      )}

                      {isWished && (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full bg-rose-subtle text-primary py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-rose-light/50"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                          It's a Match! 💕
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistSection;
