import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Heart } from 'lucide-react';
import { ChatMessage } from '@/types/trip';
import { motion, AnimatePresence } from 'framer-motion';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: '¡Hola Vicente! ✨ Soy tu asistente de viajes de élite. Tu luna de miel de 45 días por 6 países va tomando forma. ¿En qué te puedo ayudar? Puedo sugerir restaurantes románticos, organizar transfers o revisar tus reservas. 💕',
    timestamp: new Date().toISOString(),
  },
];

const ChatView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(input),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-romantic flex items-center justify-center shadow-[var(--shadow-romantic)]">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Asistente de Viajes ✨</h3>
            <p className="text-[10px] text-muted-foreground">Tu guía romántica · En línea</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-hero text-primary-foreground rounded-br-md shadow-[var(--shadow-romantic)]'
                  : 'bg-secondary text-secondary-foreground rounded-bl-md border border-border'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 border border-border">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-light animate-pulse-soft" />
                <span className="w-2 h-2 rounded-full bg-rose-light animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-rose-light animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe una idea para tu viaje... ✨"
            className="flex-1 bg-secondary text-sm rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="touch-target gradient-hero text-primary-foreground p-3 rounded-2xl disabled:opacity-40 transition-all active:scale-95 shadow-[var(--shadow-romantic)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('restaurante') || lower.includes('cena') || lower.includes('comer')) {
    return '🍽️ ¡Excelente idea! Para esa fecha te recomiendo:\n\n1. **Nobu Dubai** - Fusión japonesa de clase mundial\n2. **Zuma** - Cocina japonesa contemporánea\n3. **Pierchic** - Mariscos con vista al océano 🌊\n\n¿Quieres que agregue alguno al itinerario? 💕';
  }
  if (lower.includes('hotel') || lower.includes('alojamiento')) {
    return '🏨 He revisado las opciones más románticas para esas fechas. Te sugiero buscar en la zona premium. ¿Quieres que lo agregue como borrador al itinerario? Recuerda: necesitarás subir la confirmación para validarlo ✨';
  }
  if (lower.includes('vuelo') || lower.includes('avión')) {
    return '✈️ Perfecto. He tomado nota del vuelo. Lo agregaré como borrador. Para confirmarlo, necesitaré que subas el e-ticket o confirmación de la aerolínea. ¿Necesitas conexiones alternativas? 🌟';
  }
  return '📝 ¡Entendido! Lo agregaré al itinerario como borrador. Recuerda que puedes subir el comprobante de reserva para cambiar su estado a "Confirmado". ¿Algo más para hacer este viaje aún más mágico? ✨💕';
}

export default ChatView;
