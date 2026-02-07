import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types/trip';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type AiMsg = { role: 'user' | 'assistant'; content: string };

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
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const streamChat = useCallback(async (allMessages: AiMsg[]) => {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      const errMsg = errData.error || 'Error al contactar el asistente';
      if (resp.status === 429) toast.error('Demasiadas solicitudes, espera un momento');
      else if (resp.status === 402) toast.error('Créditos de IA agotados');
      else toast.error(errMsg);
      throw new Error(errMsg);
    }

    if (!resp.body) throw new Error('No stream body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantContent = '';
    const assistantId = Date.now().toString();

    // Create the assistant message placeholder
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            const snapshot = assistantContent;
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: snapshot } : m)
            );
          }
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    // Final flush
    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            const snapshot = assistantContent;
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: snapshot } : m)
            );
          }
        } catch { /* ignore */ }
      }
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMessages: AiMsg[] = [
      ...messages.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: input },
    ];

    try {
      await streamChat(aiMessages);
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, streamChat]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-romantic flex items-center justify-center shadow-[var(--shadow-romantic)]">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Asistente de Viajes ✨</h3>
            <p className="text-[10px] text-muted-foreground">Powered by AI · En línea</p>
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
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'gradient-hero text-primary-foreground rounded-br-md shadow-[var(--shadow-romantic)]'
                  : 'bg-secondary text-secondary-foreground rounded-bl-md border border-border'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
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
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Escribe una idea para tu viaje... ✨"
            disabled={isLoading}
            className="flex-1 bg-secondary text-sm rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="touch-target gradient-hero text-primary-foreground p-3 rounded-2xl disabled:opacity-40 transition-all active:scale-95 shadow-[var(--shadow-romantic)]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
