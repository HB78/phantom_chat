import {
  encryptMessage,
  decryptMessage,
  generateHybridKeyPair,
  exportHybridPublicKeys,
  deriveHybridSharedKeyAsInitiator,
  deriveHybridSharedKeyAsResponder,
  type HybridKeyPair,
  type ExportedPublicKeys,
} from '@/lib/crypto';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Donnees de cles publiques echangees entre les deux users
 */
export interface HybridPublicKeyData {
  ecdh: string;
  kyber: string;
  kyberCiphertext?: string; // Seulement present quand envoye par l'initiateur
}

interface UseHybridEncryptionReturn {
  /** true quand le chiffrement E2E hybride est pret */
  isReady: boolean;
  /** Tes cles publiques en base64 a envoyer a l'autre user */
  publicKeys: ExportedPublicKeys | null;
  /** true si tu es l'initiateur (premier a recevoir la cle de l'autre) */
  isInitiator: boolean;
  /** Ciphertext Kyber a envoyer (seulement pour l'initiateur) */
  kyberCiphertext: string | null;
  /**
   * Appeler avec les cles publiques de l'autre user pour activer le chiffrement
   * @param keys - Cles publiques de l'autre user
   * @param kyberCiphertext - Ciphertext Kyber (seulement pour le destinataire)
   */
  setOtherPublicKeys: (
    keys: { ecdh: string; kyber: string },
    kyberCiphertext?: string
  ) => Promise<void>;
  /** Chiffre un message */
  encrypt: (message: string) => Promise<string>;
  /** Dechiffre un message */
  decrypt: (encryptedMessage: string) => Promise<string>;
}

export function useHybridEncryption(): UseHybridEncryptionReturn {
  const [keyPair, setKeyPair] = useState<HybridKeyPair | null>(null);
  const [publicKeys, setPublicKeys] = useState<ExportedPublicKeys | null>(null);
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [kyberCiphertext, setKyberCiphertext] = useState<string | null>(null);

  // Ref pour eviter les doubles initialisations en mode strict
  const initRef = useRef(false);

  // 1. Generer les cles hybrides au montage du composant
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      // Generer la paire de cles hybride (ECDH + Kyber)
      const keys = await generateHybridKeyPair();
      setKeyPair(keys);

      // Exporter les cles publiques
      const exported = await exportHybridPublicKeys(keys);
      setPublicKeys(exported);
    };
    init();
  }, []);

  // 2. Recevoir les cles publiques de l'autre user et calculer la cle partagee
  const setOtherPublicKeys = useCallback(
    async (
      otherKeys: { ecdh: string; kyber: string },
      receivedKyberCiphertext?: string
    ) => {
      if (!keyPair) {
        throw new Error('Key pair not generated yet');
      }

      if (receivedKyberCiphertext) {
        // Je suis le DESTINATAIRE (j'ai recu le ciphertext de l'initiateur)
        const shared = await deriveHybridSharedKeyAsResponder(
          keyPair,
          otherKeys.ecdh,
          receivedKyberCiphertext
        );
        setSharedKey(shared);
        setIsInitiator(false);
      } else {
        // Je suis l'INITIATEUR (premier a recevoir les cles de l'autre)
        const { sharedKey: shared, kyberCiphertext: ciphertext } =
          await deriveHybridSharedKeyAsInitiator(
            keyPair,
            otherKeys.ecdh,
            otherKeys.kyber
          );
        setSharedKey(shared);
        setKyberCiphertext(ciphertext);
        setIsInitiator(true);
      }
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

  // 4. Dechiffrer un message
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
    publicKeys,
    isInitiator,
    kyberCiphertext,
    setOtherPublicKeys,
    encrypt,
    decrypt,
  };
}

// ============ HOOK LEGACY (COMPATIBILITE) ============

// Re-export du hook original pour compatibilite
// Tu peux supprimer ca une fois la migration terminee

import {
  generateKeyPair,
  deriveSharedKey,
  exportPublicKey,
  importPublicKey,
} from '@/lib/crypto';

interface UseEncryptionReturn {
  isReady: boolean;
  publicKeyBase64: string | null;
  setOtherPublicKey: (key: string) => Promise<void>;
  encrypt: (message: string) => Promise<string>;
  decrypt: (encryptedMessage: string) => Promise<string>;
}

export function useEncryption(): UseEncryptionReturn {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyBase64, setPublicKeyBase64] = useState<string | null>(null);
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const init = async () => {
      const keys = await generateKeyPair();
      setKeyPair(keys);
      const exported = await exportPublicKey(keys.publicKey);
      setPublicKeyBase64(exported);
    };
    init();
  }, []);

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

  const encrypt = useCallback(
    async (message: string): Promise<string> => {
      if (!sharedKey) {
        throw new Error('Encryption not ready - no shared key');
      }
      return encryptMessage(message, sharedKey);
    },
    [sharedKey]
  );

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
