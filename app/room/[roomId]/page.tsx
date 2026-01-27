'use client';

import Header from '@/components/Hearder';
import { ImageUpload } from '@/components/ImageUpload';
import MessageList from '@/components/MessageList';
import {
  useFetchMessages,
  useGetOtherHybridPublicKeys,
  useGetTimeRemaining,
  useSendHybridPublicKeys,
  useSendKyberCiphertext,
  useSendMessage,
} from '@/hooks/fetch/rooms';
import { useCountdown } from '@/hooks/use-countdown';
import { useHybridEncryption } from '@/hooks/use-encryption';
import { useUsername } from '@/hooks/use-username';
import { processImage } from '@/lib/image/process';
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // ============ E2E HYBRID ENCRYPTION (ECDH + KYBER) ============
  const {
    isReady: isEncryptionReady,
    publicKeys,
    isInitiator,
    kyberCiphertext,
    setOtherPublicKeys,
    encrypt,
    decrypt,
  } = useHybridEncryption();

  // Cache des messages decryptes
  const decryptedCache = useRef<Map<string, string>>(new Map());

  // Refs pour eviter les closures
  const publicKeysRef = useRef<{ ecdh: string; kyber: string } | null>(null);
  publicKeysRef.current = publicKeys;

  const { mutate: sendHybridPublicKeys } = useSendHybridPublicKeys();
  const { mutate: sendKyberCiphertext } = useSendKyberCiphertext();
  const { data: otherKeyData } = useGetOtherHybridPublicKeys(roomId);

  // Flag pour savoir si on a deja traite les cles de l'autre
  const hasProcessedOtherKeysRef = useRef(false);
  // Flag pour savoir si on a deja envoye le ciphertext
  const hasSentCiphertextRef = useRef(false);

  // 1. Envoyer mes cles publiques hybrides quand elles sont pretes
  useEffect(() => {
    if (publicKeys) {
      sendHybridPublicKeys({ roomId, publicKeys });
    }
  }, [publicKeys, roomId, sendHybridPublicKeys]);

  // 2. Recevoir les cles de l'autre user (via polling)
  useEffect(() => {
    if (
      otherKeyData?.ecdh &&
      otherKeyData?.kyber &&
      !hasProcessedOtherKeysRef.current
    ) {
      hasProcessedOtherKeysRef.current = true;

      // Si j'ai deja un ciphertext, je suis le destinataire
      if (otherKeyData.kyberCiphertext) {
        setOtherPublicKeys(
          { ecdh: otherKeyData.ecdh, kyber: otherKeyData.kyber },
          otherKeyData.kyberCiphertext
        );
      } else {
        // Sinon je suis l'initiateur
        setOtherPublicKeys({
          ecdh: otherKeyData.ecdh,
          kyber: otherKeyData.kyber,
        });
      }
    }
  }, [otherKeyData, setOtherPublicKeys]);

  // 3. Envoyer le ciphertext Kyber si je suis l'initiateur
  useEffect(() => {
    if (isInitiator && kyberCiphertext && !hasSentCiphertextRef.current) {
      hasSentCiphertextRef.current = true;
      sendKyberCiphertext({ roomId, kyberCiphertext });
    }
  }, [isInitiator, kyberCiphertext, roomId, sendKyberCiphertext]);

  // Vider le cache quand E2E devient pret
  useEffect(() => {
    if (isEncryptionReady) {
      decryptedCache.current.clear();
    }
  }, [isEncryptionReady]);

  // Decrypter un message (avec cache)
  const getDecryptedText = async (msg: { id: string; text: string }) => {
    if (isEncryptionReady && decryptedCache.current.has(msg.id)) {
      return decryptedCache.current.get(msg.id)!;
    }

    if (isEncryptionReady) {
      try {
        const decryptedText = await decrypt(msg.text);
        decryptedCache.current.set(msg.id, decryptedText);
        return decryptedText;
      } catch {
        decryptedCache.current.set(msg.id, msg.text);
        return msg.text;
      }
    }

    return msg.text;
  };

  // Messages avec texte decrypte
  const [decryptedMessages, setDecryptedMessages] = useState<
    {
      id: string;
      sender: string;
      text: string;
      timestamp: number;
      roomId: string;
      messageType?: 'text' | 'image';
      imageMetadata?: { mimeType: string; width: number; height: number };
    }[]
  >([]);

  // Decrypter les nouveaux messages
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
    events: [
      'chat.messageSchema',
      'chat.destroy',
      'chat.keyExchange',
      'chat.kyberCiphertext',
    ],
    onData: ({ event, data }) => {
      if (event === 'chat.messageSchema') {
        refetch();
      }

      if (event === 'chat.destroy') {
        router.push('/create?destroyed=true');
      }

      // Recevoir les cles de l'autre user (via realtime)
      if (event === 'chat.keyExchange' && !hasProcessedOtherKeysRef.current) {
        const { ecdh, kyber } = data as { ecdh: string; kyber: string };
        // Ne pas accepter ses propres cles
        if (
          publicKeysRef.current &&
          (ecdh !== publicKeysRef.current.ecdh ||
            kyber !== publicKeysRef.current.kyber)
        ) {
          hasProcessedOtherKeysRef.current = true;
          setOtherPublicKeys({ ecdh, kyber });
        }
      }

      // Recevoir le ciphertext Kyber (pour le destinataire)
      if (event === 'chat.kyberCiphertext' && !isEncryptionReady) {
        const { kyberCiphertext: ciphertext } = data as {
          kyberCiphertext: string;
        };
        // Re-traiter les cles avec le ciphertext
        if (otherKeyData?.ecdh && otherKeyData?.kyber) {
          setOtherPublicKeys(
            { ecdh: otherKeyData.ecdh, kyber: otherKeyData.kyber },
            ciphertext
          );
        }
      }
    },
  });

  // ============ SEND MESSAGE ============
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    let textToSend = input;

    if (isEncryptionReady) {
      textToSend = await encrypt(input);
    }

    sendMessage({ text: textToSend, sender: username, roomId, messageType: 'text' });
    setInput('');
    inputRef.current?.focus();
  };

  // ============ SEND IMAGE ============
  const handleImageSelect = async (file: File) => {
    if (!isEncryptionReady) {
      alert('Attendez que le chiffrement soit etabli.');
      return;
    }

    setIsUploadingImage(true);
    setShowImageUpload(false);

    try {
      // 1. Traiter l'image (supprime EXIF + compresse)
      const processed = await processImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        maxSizeBytes: 20 * 1024 * 1024,
      });

      // 2. Chiffrer le base64 de l'image
      const encryptedImage = await encrypt(processed.base64);

      // 3. Envoyer comme message de type "image"
      sendMessage({
        text: encryptedImage,
        sender: username,
        roomId,
        messageType: 'image',
        imageMetadata: {
          mimeType: processed.mimeType,
          width: processed.width,
          height: processed.height,
        },
      });
    } catch (err) {
      console.error('Failed to send image:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de l\'image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <main className="flex h-screen max-h-screen flex-col overflow-hidden">
      <Header roomId={roomId} timeRemaining={timeRemaining} />

      {/* MESSAGES */}
      <MessageList
        isLoading={isLoading}
        error={error}
        messages={
          decryptedMessages.length > 0
            ? { messages: decryptedMessages }
            : messages
        }
        username={username}
      />

      {/* ENCRYPTION STATUS */}
      {!isEncryptionReady && (
        <div className="border-t border-zinc-800 bg-amber-950/30 px-4 py-2 text-center">
          <p className="text-xs text-amber-400">
            🔓 Waiting for other user to establish quantum-safe encrypted
            connection...
          </p>
        </div>
      )}

      {/* INPUT */}
      <footer className="border-t border-zinc-800 bg-zinc-900/30 p-4">
        {isEncryptionReady && (
          <p className="mb-2 text-center text-xs text-green-400">
            🔐 Post-quantum E2E encrypted (ECDH + Kyber)
          </p>
        )}

        {isUploadingImage && (
          <p className="mb-2 text-center text-xs text-amber-400">
            📤 Envoi de l'image en cours...
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Image Upload Button */}
          <div className="relative">
            {showImageUpload ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                onCancel={() => setShowImageUpload(false)}
                disabled={!isEncryptionReady || isUploadingImage}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowImageUpload(true)}
                disabled={!isEncryptionReady || isUploadingImage}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors hover:border-green-500 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Upload image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </button>
            )}
          </div>

          {/* Text Input */}
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

          {/* Send Button */}
          <button
            type="submit"
            disabled={isPending || !input.trim() || isUploadingImage}
            aria-label="Send message"
            className="cursor-pointer rounded-md bg-zinc-800 px-6 py-3 text-sm font-bold text-zinc-400 transition-all hover:text-zinc-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            SEND
          </button>
        </form>
      </footer>
    </main>
  );
}
