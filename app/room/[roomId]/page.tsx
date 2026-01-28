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
  const clearKeysRef = useRef<() => void>(() => {});
  const timeRemaining = useCountdown(ttlData?.ttl, () => {
    clearKeysRef.current();
    router.push('/create?destroyed=true');
  });

  const { username } = useUsername();

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // ============ E2E HYBRID ENCRYPTION (ECDH + KYBER) ============
  const {
    isReady: isEncryptionReady,
    publicKeys,
    isInitiator,
    kyberCiphertext,
    setOtherPublicKeys,
    encrypt,
    decrypt,
    clearKeys,
  } = useHybridEncryption(roomId);

  // Mettre a jour la ref quand clearKeys change
  useEffect(() => {
    clearKeysRef.current = clearKeys;
  }, [clearKeys]);

  // Cache des messages decryptes
  const decryptedCache = useRef<Map<string, string>>(new Map());

  const { mutate: sendHybridPublicKeys } = useSendHybridPublicKeys();
  const { mutate: sendKyberCiphertext } = useSendKyberCiphertext();
  const { data: otherKeyData, refetch: refetchKeys } = useGetOtherHybridPublicKeys(
    roomId,
    isEncryptionReady
  );

  // Flag pour savoir si on a deja envoye le ciphertext
  const hasSentCiphertextRef = useRef(false);
  // Track if we're currently processing to avoid double processing
  const isProcessingRef = useRef(false);

  // 1. Envoyer mes cles publiques hybrides quand elles sont pretes
  useEffect(() => {
    if (publicKeys) {
      console.log('📤 Sending my public keys to server');
      sendHybridPublicKeys({ roomId, publicKeys });
    }
  }, [publicKeys, roomId, sendHybridPublicKeys]);

  // 2. Recevoir les cles de l'autre user et etablir le chiffrement
  useEffect(() => {
    const processKeyExchange = async () => {
      // Skip if already ready or currently processing
      if (isEncryptionReady || isProcessingRef.current) return;
      
      // Attendre d'avoir les cles de l'autre
      if (!otherKeyData?.ecdh || !otherKeyData?.kyber) {
        console.log('⏳ Waiting for other user\'s keys...');
        return;
      }

      console.log('📥 Received other user\'s keys', {
        hasEcdh: !!otherKeyData.ecdh,
        hasKyber: !!otherKeyData.kyber,
        hasCiphertext: !!otherKeyData.kyberCiphertext,
        shouldBeInitiator: otherKeyData.shouldBeInitiator,
      });

      try {
        // Si j'ai un ciphertext, je suis le DESTINATAIRE (responder)
        if (otherKeyData.kyberCiphertext) {
          isProcessingRef.current = true;
          console.log('🔑 Processing as RESPONDER (received ciphertext)');
          await setOtherPublicKeys(
            { ecdh: otherKeyData.ecdh, kyber: otherKeyData.kyber },
            otherKeyData.kyberCiphertext
          );
          console.log('✅ Encryption ready as responder!');
        }
        // Sinon, si je dois etre l'INITIATEUR (selon le serveur)
        else if (otherKeyData.shouldBeInitiator) {
          isProcessingRef.current = true;
          console.log('🔑 Processing as INITIATOR (will send ciphertext)');
          await setOtherPublicKeys({
            ecdh: otherKeyData.ecdh,
            kyber: otherKeyData.kyber,
          });
          console.log('✅ Encryption ready as initiator!');
        } else {
          // Ne PAS mettre isProcessingRef à true ici - permettre le retry au prochain refetch
          console.log('⏳ Waiting for initiator to send ciphertext...');
        }
      } catch (err) {
        console.error('❌ Key exchange error:', err);
        // Reset processing flag on error to allow retry
        isProcessingRef.current = false;
      }
    };

    processKeyExchange();
  }, [otherKeyData, setOtherPublicKeys, isEncryptionReady]);

  // 3. Envoyer le ciphertext Kyber si je suis l'initiateur
  useEffect(() => {
    if (isInitiator && kyberCiphertext && !hasSentCiphertextRef.current) {
      console.log('📤 Sending Kyber ciphertext to other user');
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
    events: ['chat.messageSchema', 'chat.destroy', 'chat.keyExchange', 'chat.kyberCiphertext'],
    onData: ({ event }) => {
      if (event === 'chat.messageSchema') {
        refetch();
      }

      if (event === 'chat.destroy') {
        clearKeysRef.current();
        router.push('/create?destroyed=true');
      }

      // Refetch keys when other user sends their keys or ciphertext
      if (event === 'chat.keyExchange' || event === 'chat.kyberCiphertext') {
        console.log(`🔔 Received ${event} event, refetching keys...`);
        refetchKeys().then((result) => {
          console.log('📦 Refetch result:', result.data);
        });
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
          <ImageUpload
            onImageSelect={handleImageSelect}
            onCancel={() => {}}
            disabled={!isEncryptionReady || isUploadingImage}
          />

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
