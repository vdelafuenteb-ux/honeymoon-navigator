import { useState, useRef, useCallback } from 'react';
import { TripEvent } from '@/types/trip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { eventTypeConfig } from '@/lib/eventConfig';
import { CheckCircle2, Clock, Upload, FileCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventEditModalProps {
  event: TripEvent | null;
  open: boolean;
  onClose: () => void;
  onUploadReceipt?: (eventId: string, file: File) => Promise<string | null>;
}

const EventEditModal = ({ event, open, onClose, onUploadReceipt }: EventEditModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!event) return null;

  const config = eventTypeConfig[event.type];
  const Icon = config.icon;

  const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadReceipt) return;

    setUploading(true);
    const result = await onUploadReceipt(event.id, file);
    setUploading(false);
    if (result) {
      setUploaded(true);
      setTimeout(() => onClose(), 1200);
    }
  };

  const handleClose = () => {
    setUploaded(false);
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              event.status === 'confirmed' || uploaded ? 'status-confirmed' : 'status-draft'
            }`}>
              {event.status === 'confirmed' || uploaded ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {event.status === 'confirmed' || uploaded ? 'Confirmado' : 'Borrador'}
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {uploaded ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full rounded-xl p-5 flex flex-col items-center gap-2 bg-status-confirmed-bg"
              >
                <FileCheck className="w-8 h-8 text-status-confirmed" />
                <span className="text-sm font-semibold text-status-confirmed">¡Comprobante verificado!</span>
                <span className="text-xs text-muted-foreground">Evento confirmado automáticamente</span>
              </motion.div>
            ) : event.status === 'draft' ? (
              <motion.button
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm font-medium">Subiendo comprobante...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span className="text-sm font-medium">Subir comprobante para confirmar</span>
                    <span className="text-xs">PDF, JPG o PNG</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full rounded-xl p-4 flex items-center gap-3 bg-status-confirmed-bg"
              >
                <FileCheck className="w-5 h-5 text-status-confirmed" />
                <div>
                  <span className="text-sm font-semibold text-status-confirmed">Comprobante adjunto</span>
                  <p className="text-xs text-muted-foreground">Este evento está confirmado</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
