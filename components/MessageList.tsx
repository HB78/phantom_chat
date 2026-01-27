'use client';

import { Message } from '@/lib/realtime-setup/realtime';
import { format } from 'date-fns';
import { useState } from 'react';

interface MessageListProps {
  isLoading: boolean;
  error: Error | null;
  messages: { messages: Message[] } | undefined | null;
  username: string;
}

// Composant pour afficher une image avec lightbox
function MessageImage({ src, alt }: { src: string; alt: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="mt-2 max-h-64 max-w-full cursor-pointer rounded-md object-contain transition-transform hover:scale-[1.02]"
        onClick={() => setIsExpanded(true)}
      />

      {/* Lightbox */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsExpanded(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
          <button
            className="absolute right-4 top-4 rounded-full bg-zinc-800 p-2 text-white hover:bg-zinc-700"
            onClick={() => setIsExpanded(false)}
            aria-label="Fermer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
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
        const isImage = msg.messageType === 'image';

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

              {isImage ? (
                // Afficher l'image
                <MessageImage
                  src={msg.text}
                  alt={`Image de ${msg.sender}`}
                />
              ) : (
                // Afficher le texte
                <p
                  className={`text-sm leading-relaxed break-all ${isOwnMessage ? 'text-zinc-200' : 'text-zinc-300'}`}
                >
                  {msg.text}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default MessageList;
