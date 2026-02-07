import { useState, useRef } from 'react';
import { TripEvent } from '@/types/trip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { eventTypeConfig } from '@/lib/eventConfig';
import { CheckCircle2, Clock, Upload, FileCheck, Loader2, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventEditModalProps {
  event: TripEvent | null;
  open: boolean;
  onClose: () => void;
  onUploadReceipt?: (eventId: string, file: File) => Promise<string | null>;
}

const EventEditModal = ({ event, open, onClose, onUploadReceipt }: EventEditModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
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
    setUploadState('uploading');

    // Show analyzing state after a short delay
    const timer = setTimeout(() => setUploadState('analyzing'), 800);

    const result = await onUploadReceipt(event.id, file);
    clearTimeout(timer);
    setUploading(false);

    if (result) {
      setUploadState('done');
      setTimeout(() => {
        onClose();
        setUploadState('idle');
      }, 2000);
    } else {
      setUploadState('idle');
    }
  };

  const handleClose = () => {
    setUploadState('idle');
    setUploading(false);
    onClose();
  };

  const isDone = uploadState === 'done';
  const isConfirmed = event.status === 'confirmed' && uploadState === 'idle';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-display">
            <div className={`p-2 rounded-xl bg-rose-subtle ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isConfirmed || isDone ? 'status-confirmed' : 'status-draft'
            }`}>
              {isConfirmed || isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {isConfirmed || isDone ? 'Confirmado' : 'Borrador'}
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
            {event.cost_actual && (
              <Field label="Costo real (IA)" value={`$${event.cost_actual.toLocaleString()} ${event.currency || 'USD'}`} highlight />
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
            {isDone ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full rounded-2xl p-5 flex flex-col items-center gap-2 bg-status-confirmed-bg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                >
                  <FileCheck className="w-10 h-10 text-status-confirmed" />
                </motion.div>
                <span className="text-sm font-semibold text-status-confirmed">¡Comprobante verificado con IA! ✨</span>
                <span className="text-xs text-muted-foreground">Datos extraídos y evento actualizado</span>
              </motion.div>
            ) : uploadState === 'analyzing' ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full rounded-2xl p-5 flex flex-col items-center gap-3 bg-lavender-light border border-lavender/20"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Brain className="w-8 h-8 text-lavender" />
                </motion.div>
                <span className="text-sm font-semibold text-foreground">IA analizando documento...</span>
                <span className="text-xs text-muted-foreground">Extrayendo fecha, lugar, precio y más</span>
                <div className="flex gap-1 mt-1">
                  {['Fecha', 'Hora', 'Lugar', 'Precio'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.2 }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-lavender/10 text-lavender"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ) : uploadState === 'uploading' ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full rounded-2xl p-5 flex flex-col items-center gap-2 bg-rose-subtle"
              >
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">Subiendo comprobante...</span>
              </motion.div>
            ) : event.status === 'draft' ? (
              <motion.button
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-rose-light/50 rounded-2xl p-5 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-50 bg-rose-subtle/30 hover:bg-rose-subtle/60"
              >
                <div className="w-12 h-12 rounded-full gradient-romantic flex items-center justify-center mb-1">
                  <Upload className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">Subir comprobante para confirmar</span>
                <span className="text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  La IA extraerá los datos automáticamente
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full rounded-2xl p-4 flex items-center gap-3 bg-status-confirmed-bg"
              >
                <FileCheck className="w-5 h-5 text-status-confirmed" />
                <div>
                  <span className="text-sm font-semibold text-status-confirmed">Comprobante adjunto ✓</span>
                  <p className="text-xs text-muted-foreground">Verificado por IA</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
    <p className={`text-sm mt-0.5 ${highlight ? 'text-status-confirmed font-semibold' : 'text-foreground'}`}>{value}</p>
  </div>
);

export default EventEditModal;
