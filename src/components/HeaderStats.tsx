import { TripStats } from '@/types/trip';
import { Calendar, DollarSign, CheckCircle2, Globe } from 'lucide-react';

interface HeaderStatsProps {
  stats: TripStats;
}

const HeaderStats = ({ stats }: HeaderStatsProps) => {
  const budgetPercent = Math.round((stats.budgetSpent / stats.budgetEstimated) * 100);

  return (
    <header className="gradient-hero px-4 pt-6 pb-8 text-primary-foreground">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1">
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
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Días restantes"
            value={`${stats.daysRemaining}`}
            sub={`de ${stats.totalDays}`}
          />
          <StatCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Presupuesto"
            value={`$${(stats.budgetSpent / 1000).toFixed(1)}k`}
            sub={`${budgetPercent}% usado`}
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Confirmado"
            value={`${stats.percentConfirmed}%`}
            sub={`${stats.eventsCount} eventos`}
          />
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
    <div className="flex items-center justify-center gap-1 opacity-70 mb-1">
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-xl font-bold leading-none">{value}</p>
    <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>
  </div>
);

export default HeaderStats;
