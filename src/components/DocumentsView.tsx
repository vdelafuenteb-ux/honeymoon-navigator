import { FileText, Upload, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentsView = () => {
  const documents = [
    { id: '1', name: 'Vuelo SCL-ATH LATAM.pdf', type: 'flight', date: '2026-03-03', verified: true },
    { id: '2', name: 'Hotel Grande Bretagne.pdf', type: 'hotel', date: '2026-03-03', verified: true },
    { id: '3', name: 'Ferry Blue Star.pdf', type: 'transport', date: '2026-03-07', verified: true },
    { id: '4', name: 'Emirates ATH-DXB.pdf', type: 'flight', date: '2026-03-11', verified: true },
    { id: '5', name: 'Aman Tokyo Confirmation.pdf', type: 'hotel', date: '2026-04-08', verified: true },
  ];

  return (
    <div className="px-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4 mt-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Buscar documentos..."
            className="w-full bg-secondary text-sm rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <button className="w-full border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors mb-4">
        <Upload className="w-6 h-6" />
        <span className="text-sm font-medium">Subir comprobante de reserva</span>
        <span className="text-xs">PDF, JPG o PNG · La IA extraerá los datos automáticamente</span>
      </button>

      <h3 className="text-sm font-semibold text-foreground mb-3">Documentos verificados</h3>
      <div className="space-y-2">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="p-2 rounded-lg bg-status-confirmed-bg">
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
    </div>
  );
};

export default DocumentsView;
