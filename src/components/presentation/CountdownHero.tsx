import { motion } from 'framer-motion';
import { Heart, Sparkles, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownHeroProps {
  daysRemaining: number;
  totalDays: number;
  percentConfirmed: number;
  totalEvents: number;
  confirmedEvents: number;
  coupleNames: [string, string];
  countriesCount: number;
  onEnter: () => void;
}

const CountdownHero = ({ daysRemaining, totalDays, percentConfirmed, totalEvents, confirmedEvents, coupleNames, countriesCount, onEnter }: CountdownHeroProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const namesLabel = coupleNames[0] && coupleNames[1]
    ? `${coupleNames[0]} & ${coupleNames[1]}`
    : 'Nuestra Gran Aventura';

  const subtitle = [
    totalDays > 0 ? `${totalDays} días` : null,
    countriesCount > 0 ? `${countriesCount} países` : null,
    'Un amor infinito ✨',
  ].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background px-6">
      <div className="absolute inset-0 sparkle-bg opacity-60" />

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-12 text-rose-light/30"
      >
        <Heart className="w-8 h-8 fill-current" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-32 left-10 text-gold-light/30"
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center relative z-10 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full gradient-romantic flex items-center justify-center shadow-[var(--shadow-romantic)]"
        >
          <Heart className="w-9 h-9 text-primary-foreground fill-current" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium mb-2"
        >
          {namesLabel}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold text-foreground italic leading-tight"
        >
          Nuestra Gran{' '}
          <span className="bg-gradient-to-r from-rose to-gold bg-clip-text text-transparent">
            Aventura
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-muted-foreground mt-3 text-sm"
        >
          {subtitle}
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', bounce: 0.3 }}
          className="mt-8 bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border shadow-[var(--shadow-romantic)]"
        >
          {daysRemaining > 0 ? (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Faltan</p>
              <p className="text-6xl font-display font-bold text-primary italic">{daysRemaining}</p>
              <p className="text-sm text-muted-foreground mt-1">días para nuestra aventura 💕</p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">🎉</p>
              <p className="text-3xl font-display font-bold text-primary italic">¡La aventura comienza!</p>
            </>
          )}

          {totalEvents > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Plane className="w-3 h-3" />
                  Nuestro sueño
                </span>
                <span className="font-semibold text-primary">{percentConfirmed}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentConfirmed}%` }}
                  transition={{ delay: 1.5, duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full gradient-romantic relative"
                >
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                  >
                    <span className="text-xs">✈️</span>
                  </motion.div>
                </motion.div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <span className="text-xs">💕</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center italic">
                {confirmedEvents} de {totalEvents} experiencias confirmadas
              </p>
            </div>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="mt-8 gradient-hero text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-sm shadow-[var(--shadow-romantic)] flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          Descubrir nuestra aventura
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CountdownHero;
