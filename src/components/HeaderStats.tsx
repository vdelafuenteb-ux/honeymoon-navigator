import { useRef } from 'react';
import { TripStats } from '@/types/trip';
import { Calendar, DollarSign, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeaderStatsProps {
  stats: TripStats;
}

const HeaderStats = ({ stats }: HeaderStatsProps) => {
  const budgetPercent = Math.round((stats.budgetSpent / stats.budgetEstimated) * 100);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 200], [0, 40]);
  const opacity = useTransform(scrollY, [0, 150], [1, 0.85]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.97]);

  return (
    <motion.header
      ref={headerRef}
      style={{ y, opacity, scale }}
      className="gradient-hero px-4 pt-6 pb-8 text-primary-foreground sticky top-0 z-40 sparkle-bg overflow-hidden"
    >
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-4 right-8 opacity-20">
          <Sparkles className="w-5 h-5" />
        </motion.div>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-12 left-6 opacity-15">
          <Heart className="w-4 h-4" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-6 right-16 opacity-15">
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-1"
        >
          <div>
            <p className="text-sm font-medium opacity-80 tracking-widest uppercase flex items-center gap-1.5">
              <Heart className="w-3 h-3 fill-current" />
              Luna de Miel 2026
            </p>
            <h1 className="text-3xl font-display font-bold tracking-tight mt-0.5 italic">
              Honeymoon HQ
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{stats.countriesCount} países</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: <Calendar className="w-4 h-4" />, label: 'Días restantes', value: `${stats.daysRemaining}`, sub: `de ${stats.totalDays}` },
            { icon: <DollarSign className="w-4 h-4" />, label: 'Presupuesto', value: `$${(stats.budgetSpent / 1000).toFixed(1)}k`, sub: `${budgetPercent}% usado` },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Confirmado', value: `${stats.percentConfirmed}%`, sub: `${stats.eventsCount} eventos` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="bg-white/12 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10"
            >
              <div className="flex items-center justify-center gap-1 opacity-70 mb-1">
                {stat.icon}
                <span className="text-[10px] font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-bold leading-none">{stat.value}</p>
              <p className="text-[10px] opacity-60 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default HeaderStats;
