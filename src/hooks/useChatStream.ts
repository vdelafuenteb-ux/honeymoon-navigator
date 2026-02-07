import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '@/types/trip';
import { CreatedEventData, SuggestionItem, TimelineData } from '@/components/chat/ChatRichBlocks';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type AiMsg = { role: 'user' | 'assistant'; content: string };

export interface ToolCallResult {
  name: string;
  data: CreatedEventData | TimelineData | { suggestions: SuggestionItem[] };
}

export interface RichMessage extends ChatMessage {
  toolCalls?: ToolCallResult[];
}

const initialMessages: RichMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: '¡Hola Vicente! ✨ Soy tu asistente de viajes. Puedo **crear eventos**, **mostrar tu itinerario visual** o **sugerir experiencias románticas**. ¿En qué te ayudo?',
    timestamp: new Date().toISOString(),
  },
];

export const useChatStream = () => {
  const [messages, setMessages] = useState<RichMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const pendingToolCalls = useRef<ToolCallResult[]>([]);

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
      throw new Error(errData.error || 'Error al contactar el asistente');
    }

    if (!resp.body) throw new Error('No stream body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantContent = '';
    const assistantId = Date.now().toString();
    pendingToolCalls.current = [];

    // Track tool call fragments being built up during streaming
    const toolCallFragments: Record<number, { name: string; arguments: string }> = {};

    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      toolCalls: [],
    }]);

    const updateMsg = (content: string, tools: ToolCallResult[]) => {
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content, toolCalls: tools.length ? tools : m.toolCalls } : m)
      );
    };

    const processLine = (line: string) => {
      if (line.startsWith(':') || line.trim() === '') return;
      if (!line.startsWith('data: ')) return;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === '[DONE]') return;

      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta;
        if (!delta) return;

        // Text content
        if (delta.content) {
          assistantContent += delta.content;
          updateMsg(assistantContent, pendingToolCalls.current);
        }

        // Tool calls
        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (!toolCallFragments[idx]) {
              toolCallFragments[idx] = { name: '', arguments: '' };
            }
            if (tc.function?.name) {
              toolCallFragments[idx].name = tc.function.name;
            }
            if (tc.function?.arguments) {
              toolCallFragments[idx].arguments += tc.function.arguments;
            }

            // Try to parse the complete arguments
            try {
              const args = JSON.parse(toolCallFragments[idx].arguments);
              const name = toolCallFragments[idx].name;
              const existing = pendingToolCalls.current.find(
                t => t.name === name && JSON.stringify(t.data) === JSON.stringify(args)
              );
              if (!existing) {
                pendingToolCalls.current = [...pendingToolCalls.current, { name, data: args }];
                updateMsg(assistantContent, pendingToolCalls.current);
              }
            } catch {
              // Arguments not fully received yet
            }
          }
        }
      } catch {
        // Partial JSON
        buffer = line + '\n' + buffer;
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        processLine(line);
      }
    }

    // Final flush
    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        processLine(raw);
      }
    }

    return pendingToolCalls.current;
  }, []);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMsg: RichMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const aiMessages: AiMsg[] = [
      ...messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: input },
    ];

    try {
      const toolResults = await streamChat(aiMessages);
      return toolResults;
    } catch (e) {
      console.error('Chat error:', e);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, streamChat]);

  return { messages, isLoading, sendMessage, setMessages };
};
