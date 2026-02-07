import { useState, useRef, useEffect } from 'react';
import { TripStats } from '@/types/trip';
import { Calendar, DollarSign, CheckCircle2, Globe } from 'lucide-react';
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
      className="gradient-hero px-4 pt-6 pb-8 text-primary-foreground sticky top-0 z-40"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-1"
        >
          <div>
            <p className="text-sm font-medium opacity-80 tracking-wide uppercase">Luna de Miel 2026</p>
            <h1 className="text-2xl font-display font-bold tracking-tight mt-0.5">
              Honeymoon HQ
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Globe className="w-3.5 h-3.5" />
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
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
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
