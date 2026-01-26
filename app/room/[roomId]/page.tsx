'use client';

import Header from '@/components/Hearder';
import MessageList from '@/components/MessageList';
import {
  useFetchMessages,
  useGetOtherPublicKey,
  useGetTimeRemaining,
  useSendMessage,
  useSendPublicKey,
} from '@/hooks/fetch/rooms';
import { useCountdown } from '@/hooks/use-countdown';
import { useEncryption } from '@/hooks/use-encryption';
import { useUsername } from '@/hooks/use-username';
import { useRealtime } from '@/lib/realtime-setup/realtime-client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function HomeRoom() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const { mutate: sendMessage, isPending } = useSendMessage();
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useFetchMessages(roomId);

  const { data: ttlData } = useGetTimeRemaining(roomId);
  const timeRemaining = useCountdown(ttlData?.ttl, () => {
    router.push('/create?destroyed=true');
  });

  const { username } = useUsername();

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // ============ E2E ENCRYPTION ============
  const {
    isReady: isEncryptionReady,
    publicKeyBase64,
    setOtherPublicKey,
    encrypt,
    decrypt,
  } = useEncryption();

  // Cache des messages décryptés (clé = id du message)
  const decryptedCache = useRef<Map<string, string>>(new Map());

  // Ref pour éviter le problème de closure dans useRealtime
  const publicKeyRef = useRef<string | null>(null);
  publicKeyRef.current = publicKeyBase64;

  const { mutate: sendPublicKey } = useSendPublicKey();
  const { data: otherKeyData } = useGetOtherPublicKey(roomId);

  // Envoyer ma clé publique quand elle est prête
  useEffect(() => {
    if (publicKeyBase64) {
      sendPublicKey({ roomId, publicKey: publicKeyBase64 });
    }
  }, [publicKeyBase64, roomId, sendPublicKey]);

  // Recevoir la clé de l'autre user (via polling)
  useEffect(() => {
    if (otherKeyData?.otherPublicKey && !isEncryptionReady) {
      setOtherPublicKey(otherKeyData.otherPublicKey);
    }
  }, [otherKeyData, isEncryptionReady, setOtherPublicKey]);

  // Vider le cache quand E2E devient prêt (pour re-décrypter les anciens messages)
  useEffect(() => {
    if (isEncryptionReady) {
      decryptedCache.current.clear();
    }
  }, [isEncryptionReady]);

  // Décrypter un message (avec cache)
  const getDecryptedText = async (msg: { id: string; text: string }) => {
    // Vérifier le cache SEULEMENT si E2E est prêt
    if (isEncryptionReady && decryptedCache.current.has(msg.id)) {
      return decryptedCache.current.get(msg.id)!;
    }

    // Si E2E prêt, décrypter
    if (isEncryptionReady) {
      try {
        const decryptedText = await decrypt(msg.text);
        decryptedCache.current.set(msg.id, decryptedText);
        return decryptedText;
      } catch {
        // Échec = message non chiffré, garder original
        decryptedCache.current.set(msg.id, msg.text);
        return msg.text;
      }
    }

    // E2E pas prêt = ne pas cacher, retourner tel quel
    return msg.text;
  };

  // Messages avec texte décrypté (synchrone grâce au cache)
  const [decryptedMessages, setDecryptedMessages] = useState<
    { id: string; sender: string; text: string; timestamp: number; roomId: string }[]
  >([]);

  // Décrypter les nouveaux messages uniquement
  useEffect(() => {
    const decryptNewMessages = async () => {
      if (!messages?.messages) {
        setDecryptedMessages([]);
        return;
      }

      const results = await Promise.all(
        messages.messages.map(async (msg) => ({
          ...msg,
          text: await getDecryptedText(msg),
        }))
      );

      setDecryptedMessages(results);
    };

    decryptNewMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isEncryptionReady]);

  // ============ REALTIME ============
  useRealtime({
    channels: [roomId],
    events: ['chat.messageSchema', 'chat.destroy', 'chat.keyExchange'],
    onData: ({ event, data }) => {
      if (event === 'chat.messageSchema') {
        refetch();
      }

      if (event === 'chat.destroy') {
        router.push('/create?destroyed=true');
      }

      // Recevoir la clé de l'autre user (via realtime)
      // IMPORTANT: Ignorer si c'est ma propre clé publique (utilise ref pour éviter closure)
      if (event === 'chat.keyExchange') {
        const { publicKey } = data as { publicKey: string };
        // Ne pas accepter sa propre clé
        if (publicKey !== publicKeyRef.current) {
          setOtherPublicKey(publicKey);
        }
      }
    },
  });

  // ============ SEND MESSAGE ============
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    let textToSend = input;

    // Chiffrer si E2E est prêt
    if (isEncryptionReady) {
      textToSend = await encrypt(input);
    }

    sendMessage({ text: textToSend, sender: username, roomId });
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <main className="flex h-screen max-h-screen flex-col overflow-hidden">
      <Header roomId={roomId} timeRemaining={timeRemaining} />

      {/* MESSAGES */}
      <MessageList
        isLoading={isLoading}
        error={error}
        messages={decryptedMessages.length > 0 ? { messages: decryptedMessages } : messages}
        username={username}
      />

      {/* ENCRYPTION STATUS */}
      {!isEncryptionReady && (
        <div className="border-t border-zinc-800 bg-amber-950/30 px-4 py-2 text-center">
          <p className="text-xs text-amber-400">
            🔓 Waiting for other user to establish encrypted connection...
          </p>
        </div>
      )}

      {/* INPUT */}
      <footer className="border-t border-zinc-800 bg-zinc-900/30 p-4">
        {isEncryptionReady && (
          <p className="mb-2 text-center text-xs text-green-400">
            🔐 End-to-end encrypted
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-4"
        >
          <div className="group relative flex-1">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-4 -translate-y-1/2 animate-pulse text-green-400"
            >
              {'>'}
            </span>
            <label htmlFor="message-input" className="sr-only">
              Type your message
            </label>
            <input
              id="message-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              autoFocus
              autoComplete="off"
              type="text"
              className="w-full rounded-md border border-zinc-800 bg-black py-3 pr-4 pl-8 text-sm text-zinc-100 transition-colors placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            aria-label="Send message"
            className="cursor-pointer bg-zinc-800 px-6 text-sm font-bold text-zinc-400 transition-all hover:text-zinc-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            SEND
          </button>
        </form>
      </footer>
    </main>
  );
}
