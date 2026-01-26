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

      {messages?.messages.map((msg) => {
        const isOwnMessage = msg.sender === username;

        return (
          <article
            key={msg.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`group max-w-[80%] rounded-lg px-3 py-2 ${
                isOwnMessage
                  ? 'rounded-br-none bg-green-900/50 border border-green-500/30'
                  : 'rounded-bl-none bg-zinc-800/50 border border-zinc-700/50'
              }`}
            >
              <header
                className={`mb-1 flex items-baseline gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`text-xs font-bold ${isOwnMessage ? 'text-green-400' : 'text-blue-400'}`}
                >
                  {isOwnMessage ? 'You' : msg.sender}
                </span>
                <time
                  dateTime={new Date(msg.timestamp).toISOString()}
                  className="text-[10px] text-zinc-500"
                >
                  {format(msg.timestamp, 'HH:mm')}
                </time>
              </header>
              <p
                className={`text-sm leading-relaxed break-all ${isOwnMessage ? 'text-zinc-200' : 'text-zinc-300'}`}
              >
                {msg.text}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default MessageList;
