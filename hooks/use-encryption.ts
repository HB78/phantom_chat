import {
  decryptMessage,
  encryptMessage,
  generateKeyPair,
  deriveSharedKey,
  exportPublicKey,
  importPublicKey,
} from '@/lib/crypto';
import { useCallback, useEffect, useState } from 'react';

interface UseEncryptionReturn {
  /** true quand le chiffrement E2E est prêt */
  isReady: boolean;
  /** Ta clé publique en base64 à envoyer à l'autre user */
  publicKeyBase64: string | null;
  /** Appeler avec la clé publique de l'autre user pour activer le chiffrement */
  setOtherPublicKey: (key: string) => Promise<void>;
  /** Chiffre un message */
  encrypt: (message: string) => Promise<string>;
  /** Déchiffre un message */
  decrypt: (encryptedMessage: string) => Promise<string>;
}

export function useEncryption(): UseEncryptionReturn {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyBase64, setPublicKeyBase64] = useState<string | null>(null);
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);

  // 1. Générer les clés au montage du composant
  useEffect(() => {
    const init = async () => {
      const keys = await generateKeyPair();
      setKeyPair(keys);
      const exported = await exportPublicKey(keys.publicKey);
      setPublicKeyBase64(exported);
    };
    init();
  }, []);

  // 2. Recevoir la clé publique de l'autre user et calculer la clé partagée
  const setOtherPublicKey = useCallback(
    async (otherPublicKeyBase64: string) => {
      if (!keyPair) {
        throw new Error('Key pair not generated yet');
      }
      const otherPublicKey = await importPublicKey(otherPublicKeyBase64);
      const shared = await deriveSharedKey(keyPair.privateKey, otherPublicKey);
      setSharedKey(shared);
    },
    [keyPair]
  );

  // 3. Chiffrer un message
  const encrypt = useCallback(
    async (message: string): Promise<string> => {
      if (!sharedKey) {
        throw new Error('Encryption not ready - no shared key');
      }
      return encryptMessage(message, sharedKey);
    },
    [sharedKey]
  );

  // 4. Déchiffrer un message
  const decrypt = useCallback(
    async (encryptedMessage: string): Promise<string> => {
      if (!sharedKey) {
        throw new Error('Decryption not ready - no shared key');
      }
      return decryptMessage(encryptedMessage, sharedKey);
    },
    [sharedKey]
  );

  return {
    isReady: sharedKey !== null,
    publicKeyBase64,
    setOtherPublicKey,
    encrypt,
    decrypt,
  };
}
