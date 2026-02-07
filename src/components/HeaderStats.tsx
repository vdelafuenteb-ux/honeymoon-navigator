import { useRef } from 'react';
import { TripStats } from '@/types/trip';
import { Calendar, DollarSign, CheckCircle2, Heart, Sparkles, Settings } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeaderStatsProps {
  stats: TripStats;
  coupleNames: [string, string];
  onEditConfig?: () => void;
}

const HeaderStats = ({ stats, coupleNames, onEditConfig }: HeaderStatsProps) => {
  const budgetPercent = stats.budgetEstimated > 0 ? Math.round((stats.budgetSpent / stats.budgetEstimated) * 100) : 0;
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 200], [0, 40]);
  const opacity = useTransform(scrollY, [0, 150], [1, 0.85]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.97]);

  const title = coupleNames[0] && coupleNames[1]
    ? `${coupleNames[0]} & ${coupleNames[1]}`
    : 'Honeymoon HQ';

  const isEmpty = stats.eventsCount === 0;

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
              {title}
            </p>
            <h1 className="text-3xl font-display font-bold tracking-tight mt-0.5 italic">
              Honeymoon HQ
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {stats.countriesCount > 0 && (
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{stats.countriesCount} países</span>
              </div>
            )}
            <button onClick={onEditConfig} className="bg-white/15 backdrop-blur-sm p-2 rounded-full border border-white/10 hover:bg-white/25 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 bg-white/12 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
          >
            <p className="text-sm opacity-90">✨ ¡Empieza a planear tu viaje!</p>
            <p className="text-xs opacity-60 mt-1">Usa el chat para agregar destinos y actividades</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: <Calendar className="w-4 h-4" />, label: 'Días restantes', value: `${stats.daysRemaining}`, sub: `de ${stats.totalDays}` },
              { icon: <DollarSign className="w-4 h-4" />, label: 'Presupuesto', value: stats.budgetEstimated > 0 ? `$${(stats.budgetSpent / 1000).toFixed(1)}k` : '$0', sub: budgetPercent > 0 ? `${budgetPercent}% usado` : 'sin gastos' },
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
        )}
      </div>
    </motion.header>
  );
};

export default HeaderStats;
