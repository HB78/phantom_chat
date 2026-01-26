import { Message } from '@/lib/realtime-setup/realtime';
import { format } from 'date-fns';

interface MessageListProps {
  isLoading: boolean;
  error: Error | null;
  messages: { messages: Message[] } | undefined | null;
  username: string;
}

const MessageList = ({
  isLoading,
  error,
  messages,
  username,
}: MessageListProps) => {
  return (
    <section
      aria-label="Chat messages"
      aria-live="polite"
      aria-busy={isLoading}
      className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
    >
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <p className="font-mono text-sm text-zinc-400">Loading messages...</p>
        </div>
      )}

      {error && (
        <div role="alert" className="flex h-full items-center justify-center">
          <p className="font-mono text-sm text-red-400">
            Failed to load messages. Please refresh.
          </p>
        </div>
      )}

      {!isLoading && !error && messages?.messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="font-mono text-sm text-zinc-400">
            No messages yet. Start the conversation!
          </p>
        </div>
      )}

      {messages?.messages.map((msg) => (
        <article key={msg.id} className="flex flex-col items-start">
          <div className="group max-w-[80%]">
            <header className="mb-1 flex items-baseline gap-3">
              <span
                className={`text-xs font-bold ${msg.sender === username ? 'text-green-400' : 'text-blue-400'}`}
              >
                {msg.sender === username ? 'You' : msg.sender}
              </span>
              <time
                dateTime={new Date(msg.timestamp).toISOString()}
                className="text-[10px] text-zinc-400"
              >
                {format(msg.timestamp, 'HH:mm')}
              </time>
            </header>
            <p className="text-sm leading-relaxed break-all text-zinc-300">
              {msg.text}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default MessageList;
