import { useRef, useState, useCallback } from 'react';
import { FileText, Upload, Search, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Doc {
  id: string;
  name: string;
  type: string;
  date: string;
  verified: boolean;
  url?: string;
}

const initialDocs: Doc[] = [];

const DocumentsView = () => {
  const [documents, setDocuments] = useState<Doc[]>(initialDocs);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `docs/${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(path, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(data.path);

      const newDoc: Doc = {
        id: Date.now().toString(),
        name: file.name,
        type: 'general',
        date: new Date().toISOString().split('T')[0],
        verified: true,
        url: urlData.publicUrl,
      };

      setDocuments(prev => [newDoc, ...prev]);
      toast.success('✨ Documento subido correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al subir documento');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4 mt-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar documentos..."
            className="w-full bg-secondary text-sm rounded-2xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleUpload}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-rose-light/50 rounded-2xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-all mb-4 disabled:opacity-50 bg-rose-subtle/30 hover:bg-rose-subtle/60"
      >
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Subiendo...</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full gradient-romantic flex items-center justify-center mb-1">
              <Upload className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Subir comprobante de reserva</span>
            <span className="text-xs">PDF, JPG o PNG · La IA extraerá los datos automáticamente ✨</span>
          </>
        )}
      </button>

      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        Documentos verificados ({filtered.length})
      </h3>
      <AnimatePresence>
        <div className="space-y-2">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-[var(--shadow-romantic)] transition-all border border-border hover:border-rose-light/40"
            >
              <div className="p-2 rounded-xl bg-status-confirmed-bg">
                <FileText className="w-4 h-4 text-status-confirmed" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(doc.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className="status-confirmed px-2 py-0.5 rounded-full text-[10px] font-semibold">✓ Verificado</span>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default DocumentsView;
