import { useRef, useEffect, useCallback, useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useChatStream, ToolCallResult, TripContext } from '@/hooks/useChatStream';
import { SuggestionItem, QuickActions } from '@/components/chat/ChatRichBlocks';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import { TripEvent, TripCountry } from '@/types/trip';

interface ChatViewProps {
  itinerary: TripCountry[];
  onAddEvent?: (event: Partial<TripEvent> & { country: string }) => void;
  tripContext?: TripContext;
}

const ChatView = ({ itinerary, onAddEvent, tripContext }: ChatViewProps) => {
  const { messages, isLoading, sendMessage, setTripContext } = useChatStream();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const allEvents = itinerary.flatMap(c => c.days.flatMap(d => d.events));

  // Keep trip context in sync
  useEffect(() => {
    if (tripContext) setTripContext(tripContext);
  }, [tripContext, setTripContext]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    if (!text) setInput('');

    try {
      const toolResults = await sendMessage(msg);
      // Process tool call results — create events
      if (toolResults) {
        for (const tc of toolResults) {
          if (tc.name === 'create_event' && onAddEvent) {
            const data = tc.data as any;
            onAddEvent({
              type: data.type,
              title: data.title,
              location: data.location,
              country: data.country,
              datetime_start: data.datetime_start,
              datetime_end: data.datetime_end,
              notes: data.notes || '',
              cost_estimated: data.cost_estimated,
              currency: data.currency || 'USD',
              status: 'draft',
              source: 'user_chat',
            });
            toast.success(`✨ "${data.title}" agregado al itinerario`);
          }
        }
      }
    } catch (e: any) {
      if (e?.message?.includes('429')) toast.error('Demasiadas solicitudes, espera un momento');
      else if (e?.message?.includes('402')) toast.error('Créditos de IA agotados');
      else toast.error(e?.message || 'Error al contactar el asistente');
    }
  }, [input, isLoading, sendMessage, onAddEvent]);

  const handleAcceptSuggestion = useCallback((s: SuggestionItem) => {
    if (onAddEvent) {
      onAddEvent({
        type: s.type as any,
        title: s.title,
        location: s.location,
        country: s.country,
        datetime_start: s.datetime_start,
        notes: s.description,
        cost_estimated: s.cost_estimated,
        currency: s.currency || 'USD',
        status: 'draft',
        source: 'user_chat',
      });
      toast.success(`✨ "${s.title}" agregado al itinerario`);
    }
  }, [onAddEvent]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-romantic flex items-center justify-center shadow-[var(--shadow-romantic)]">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Asistente de Viajes ✨</h3>
            <p className="text-[10px] text-muted-foreground">Crea eventos · Sugiere experiencias · Visual</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              events={allEvents}
              onAcceptSuggestion={handleAcceptSuggestion}
            />
          ))}
        </AnimatePresence>

        {/* Loading dots */}
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

        {/* Quick actions — shown after initial message or when not loading */}
        {messages.length <= 2 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuickActions onAction={(text) => handleSend(text)} />
          </motion.div>
        )}
      </div>

      {/* Input */}
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
            onClick={() => handleSend()}
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
