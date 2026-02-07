import { TripEvent } from '@/types/trip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { eventTypeConfig } from '@/lib/eventConfig';
import { CheckCircle2, Clock, Upload, X } from 'lucide-react';

interface EventEditModalProps {
  event: TripEvent | null;
  open: boolean;
  onClose: () => void;
}

const EventEditModal = ({ event, open, onClose }: EventEditModalProps) => {
  if (!event) return null;

  const config = eventTypeConfig[event.type];
  const Icon = config.icon;

  const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-display">
            <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              event.status === 'confirmed' ? 'status-confirmed' : 'status-draft'
            }`}>
              {event.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {event.status === 'confirmed' ? 'Confirmado' : 'Borrador'}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{config.label}</span>
          </div>

          <div className="space-y-3">
            <Field label="Ubicación" value={event.location} />
            <Field label="Inicio" value={formatDateTime(event.datetime_start)} />
            {event.datetime_end && <Field label="Fin" value={formatDateTime(event.datetime_end)} />}
            {event.cost_estimated && (
              <Field label="Costo estimado" value={`$${event.cost_estimated.toLocaleString()} ${event.currency || 'USD'}`} />
            )}
            {event.notes && <Field label="Notas" value={event.notes} />}
          </div>

          {event.status === 'draft' && (
            <button className="w-full border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-1.5 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">Subir comprobante para confirmar</span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
    <p className="text-sm text-foreground mt-0.5">{value}</p>
  </div>
);

export default EventEditModal;
