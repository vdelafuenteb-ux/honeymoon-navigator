import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { RichMessage, ToolCallResult } from '@/hooks/useChatStream';
import { CreatedEventBlock, CreatedEventData, TimelineBlock, TimelineData, SuggestionCards, SuggestionItem } from './ChatRichBlocks';
import { TripEvent } from '@/types/trip';

interface ChatMessageBubbleProps {
  message: RichMessage;
  events: TripEvent[];
  onAcceptSuggestion?: (s: SuggestionItem) => void;
}

const ChatMessageBubble = ({ message, events, onAcceptSuggestion }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[90%] space-y-2 ${isUser ? '' : ''}`}>
        {/* Text bubble */}
        {message.content && (
          <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'gradient-hero text-primary-foreground rounded-br-md shadow-[var(--shadow-romantic)]'
              : 'bg-secondary text-secondary-foreground rounded-bl-md border border-border'
          }`}>
            {isUser ? (
              <span className="whitespace-pre-wrap">{message.content}</span>
            ) : (
              <div className="prose prose-sm max-w-none text-secondary-foreground [&_p]:my-0.5 [&_strong]:text-foreground [&_ul]:my-1 [&_li]:my-0">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Rich blocks from tool calls */}
        {message.toolCalls?.map((tc, i) => (
          <RichBlock key={i} toolCall={tc} events={events} index={i} onAcceptSuggestion={onAcceptSuggestion} />
        ))}
      </div>
    </motion.div>
  );
};

const RichBlock = ({
  toolCall,
  events,
  index,
  onAcceptSuggestion,
}: {
  toolCall: ToolCallResult;
  events: TripEvent[];
  index: number;
  onAcceptSuggestion?: (s: SuggestionItem) => void;
}) => {
  switch (toolCall.name) {
    case 'create_event':
      return <CreatedEventBlock event={toolCall.data as CreatedEventData} index={index} />;
    case 'show_timeline':
      return <TimelineBlock data={toolCall.data as TimelineData} events={events} />;
    case 'suggest_experiences': {
      const { suggestions } = toolCall.data as { suggestions: SuggestionItem[] };
      return <SuggestionCards suggestions={suggestions} onAccept={onAcceptSuggestion} />;
    }
    default:
      return null;
  }
};

export default ChatMessageBubble;
