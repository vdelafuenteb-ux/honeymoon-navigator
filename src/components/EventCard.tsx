import { TripEvent } from '@/types/trip';
import { eventTypeConfig } from '@/lib/eventConfig';
import { CheckCircle2, Clock, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: TripEvent;
  index: number;
  onEdit?: (event: TripEvent) => void;
}

const EventCard = ({ event, index, onEdit }: EventCardProps) => {
  const config = eventTypeConfig[event.type];
  const Icon = config.icon;
  const startTime = new Date(event.datetime_start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onEdit?.(event)}
      className="glass-card rounded-xl p-3.5 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm text-foreground truncate">{event.title}</h4>
            <StatusBadge status={event.status} />
          </div>

          <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.location}</p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {startTime}
            </span>
            {event.cost_estimated && (
              <span className="text-xs font-medium text-accent">
                ${event.cost_estimated.toLocaleString()} {event.currency}
              </span>
            )}
            {event.attachment_url && (
              <Paperclip className="w-3 h-3 text-status-confirmed" />
            )}
          </div>

          {event.notes && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{event.notes}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: 'draft' | 'confirmed' }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${
    status === 'confirmed' ? 'status-confirmed' : 'status-draft'
  }`}>
    {status === 'confirmed' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
    {status === 'confirmed' ? 'Confirmado' : 'Borrador'}
  </span>
);

export default EventCard;
