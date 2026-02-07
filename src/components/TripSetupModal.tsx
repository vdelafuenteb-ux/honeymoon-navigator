import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, ArrowRight, Sparkles, Plane } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { TripConfig } from '@/hooks/useTripConfig';

interface TripSetupModalProps {
  open: boolean;
  config: TripConfig;
  onSave: (updates: Partial<TripConfig>) => void;
}

const TripSetupModal = ({ open, config, onSave }: TripSetupModalProps) => {
  const [step, setStep] = useState(0);
  const [names, setNames] = useState<[string, string]>(config.coupleNames);
  const [startDate, setStartDate] = useState(config.startDate || '');
  const [endDate, setEndDate] = useState(config.endDate || '');

  if (!open) return null;

  const handleFinish = () => {
    onSave({
      coupleNames: names,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };

  const canProceed = step === 0
    ? names[0].trim().length > 0 && names[1].trim().length > 0
    : startDate && endDate;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center px-6"
      >
        <div className="absolute inset-0 sparkle-bg opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.3 }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full gradient-romantic flex items-center justify-center shadow-[var(--shadow-romantic)]"
          >
            {step === 0 ? (
              <Heart className="w-7 h-7 text-primary-foreground fill-current" />
            ) : (
              <Plane className="w-7 h-7 text-primary-foreground" />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="names" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h2 className="text-2xl font-display font-bold text-foreground italic mb-1">
                  ¿Quiénes viajan? 💕
                </h2>
                <p className="text-sm text-muted-foreground mb-6">Los protagonistas de esta aventura</p>

                <div className="space-y-3">
                  <input
                    value={names[0]}
                    onChange={e => setNames([e.target.value, names[1]])}
                    placeholder="Tu nombre"
                    className="w-full bg-card text-sm rounded-2xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border text-center"
                  />
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Heart className="w-3 h-3 fill-current text-rose-light" />
                    <span className="text-xs">&</span>
                    <Heart className="w-3 h-3 fill-current text-rose-light" />
                  </div>
                  <input
                    value={names[1]}
                    onChange={e => setNames([names[0], e.target.value])}
                    placeholder="Nombre de tu pareja"
                    className="w-full bg-card text-sm rounded-2xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border text-center"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="dates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h2 className="text-2xl font-display font-bold text-foreground italic mb-1">
                  ¿Cuándo viajan? ✈️
                </h2>
                <p className="text-sm text-muted-foreground mb-6">Selecciona las fechas de tu viaje</p>

                <div className="space-y-4">
                  <div className="text-left">
                    <label className="text-xs text-muted-foreground font-medium ml-1 mb-1 block">Ida</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-card text-sm rounded-2xl pl-10 pr-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <label className="text-xs text-muted-foreground font-medium ml-1 mb-1 block">Vuelta</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full bg-card text-sm rounded-2xl pl-10 pr-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                      />
                    </div>
                  </div>

                  {startDate && endDate && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground italic">
                      {format(parseISO(startDate), "d 'de' MMMM", { locale: es })} → {format(parseISO(endDate), "d 'de' MMMM yyyy", { locale: es })}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!canProceed}
            onClick={() => {
              if (step === 0) setStep(1);
              else handleFinish();
            }}
            className="mt-8 w-full gradient-hero text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm shadow-[var(--shadow-romantic)] flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
          >
            {step === 0 ? (
              <>Siguiente <ArrowRight className="w-4 h-4" /></>
            ) : (
              <><Sparkles className="w-4 h-4" /> Comenzar la aventura</>
            )}
          </motion.button>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[0, 1].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${s === step ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TripSetupModal;
