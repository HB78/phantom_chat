'use client';

import { Message } from '@/lib/realtime-setup/realtime';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import Image from 'next/image';
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
      <div
        className="relative mt-2 h-48 w-full max-w-xs cursor-pointer overflow-hidden rounded-md transition-transform hover:scale-[1.02]"
        onClick={() => setIsExpanded(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Lightbox */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={src}
              alt={alt}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full rounded-lg object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 rounded-full bg-zinc-800 p-2 text-white hover:bg-zinc-700"
            onClick={() => setIsExpanded(false)}
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
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
      className="scrollbar-thin scrollbar-track-zinc-900/50 scrollbar-thumb-green-500/50 hover:scrollbar-thumb-green-500/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full flex-1 space-y-4 overflow-y-auto p-4"
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
                  ? 'rounded-br-none border border-green-500/30 bg-green-900/50'
                  : 'rounded-bl-none border border-zinc-700/50 bg-zinc-800/50'
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
                <MessageImage src={msg.text} alt={`Image de ${msg.sender}`} />
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
