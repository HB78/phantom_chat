import {
    decryptMessage,
    deriveHybridSharedKeyAsInitiator,
    deriveHybridSharedKeyAsResponder,
    encryptMessage,
    exportHybridPublicKeys,
    generateHybridKeyPair,
    type ExportedPublicKeys,
    type HybridKeyPair,
} from '@/lib/crypto';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============ STORAGE KEYS ============
const STORAGE_KEY_PREFIX = 'phantom_keys_';
const STORAGE_SHARED_PREFIX = 'phantom_shared_';

// ============ STORAGE HELPERS ============

interface StoredKeys {
  ecdh: {
    publicKey: JsonWebKey;
    privateKey: JsonWebKey;
  };
  kyber: {
    publicKey: string; // base64
    privateKey: string; // base64
  };
  publicKeysExported: ExportedPublicKeys;
}

interface StoredSharedKey {
  key: JsonWebKey;
  isInitiator: boolean;
  kyberCiphertext: string | null;
}

async function saveKeysToStorage(roomId: string, keyPair: HybridKeyPair, publicKeys: ExportedPublicKeys): Promise<void> {
  try {
    const ecdhPublicJwk = await crypto.subtle.exportKey('jwk', keyPair.ecdh.publicKey);
    const ecdhPrivateJwk = await crypto.subtle.exportKey('jwk', keyPair.ecdh.privateKey);

    const stored: StoredKeys = {
      ecdh: {
        publicKey: ecdhPublicJwk,
        privateKey: ecdhPrivateJwk,
      },
      kyber: {
        publicKey: btoa(String.fromCharCode(...keyPair.kyber.publicKey)),
        privateKey: btoa(String.fromCharCode(...keyPair.kyber.privateKey)),
      },
      publicKeysExported: publicKeys,
    };

    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${roomId}`, JSON.stringify(stored));
    console.log('💾 Keys saved to sessionStorage');
  } catch (err) {
    console.error('Failed to save keys to storage:', err);
  }
}

async function loadKeysFromStorage(roomId: string): Promise<{ keyPair: HybridKeyPair; publicKeys: ExportedPublicKeys } | null> {
  try {
    const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${roomId}`);
    if (!stored) return null;

    const data: StoredKeys = JSON.parse(stored);

    const ecdhPublicKey = await crypto.subtle.importKey(
      'jwk',
      data.ecdh.publicKey,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      []
    );

    const ecdhPrivateKey = await crypto.subtle.importKey(
      'jwk',
      data.ecdh.privateKey,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey', 'deriveBits']
    );

    const kyberPublicKey = Uint8Array.from(atob(data.kyber.publicKey), c => c.charCodeAt(0));
    const kyberPrivateKey = Uint8Array.from(atob(data.kyber.privateKey), c => c.charCodeAt(0));

    console.log('📂 Keys restored from sessionStorage');

    return {
      keyPair: {
        ecdh: { publicKey: ecdhPublicKey, privateKey: ecdhPrivateKey },
        kyber: { publicKey: kyberPublicKey, privateKey: kyberPrivateKey },
      },
      publicKeys: data.publicKeysExported,
    };
  } catch (err) {
    console.error('Failed to load keys from storage:', err);
    return null;
  }
}

async function saveSharedKeyToStorage(
  roomId: string,
  sharedKey: CryptoKey,
  isInitiator: boolean,
  kyberCiphertext: string | null
): Promise<void> {
  try {
    const keyJwk = await crypto.subtle.exportKey('jwk', sharedKey);
    const stored: StoredSharedKey = { key: keyJwk, isInitiator, kyberCiphertext };
    sessionStorage.setItem(`${STORAGE_SHARED_PREFIX}${roomId}`, JSON.stringify(stored));
    console.log('💾 Shared key saved to sessionStorage');
  } catch (err) {
    console.error('Failed to save shared key:', err);
  }
}

async function loadSharedKeyFromStorage(roomId: string): Promise<StoredSharedKey & { sharedKey: CryptoKey } | null> {
  try {
    const stored = sessionStorage.getItem(`${STORAGE_SHARED_PREFIX}${roomId}`);
    if (!stored) return null;

    const data: StoredSharedKey = JSON.parse(stored);

    const sharedKey = await crypto.subtle.importKey(
      'jwk',
      data.key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    console.log('📂 Shared key restored from sessionStorage');

    return { sharedKey, isInitiator: data.isInitiator, kyberCiphertext: data.kyberCiphertext };
  } catch (err) {
    console.error('Failed to load shared key:', err);
    return null;
  }
}

export function clearEncryptionKeys(roomId: string): void {
  sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${roomId}`);
  sessionStorage.removeItem(`${STORAGE_SHARED_PREFIX}${roomId}`);
  console.log('🗑️ Encryption keys cleared from sessionStorage');
}

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
  /** Nettoie les cles stockees */
  clearKeys: () => void;
}

export function useHybridEncryption(roomId?: string): UseHybridEncryptionReturn {
  const [keyPair, setKeyPair] = useState<HybridKeyPair | null>(null);
  const [publicKeys, setPublicKeys] = useState<ExportedPublicKeys | null>(null);
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [kyberCiphertext, setKyberCiphertext] = useState<string | null>(null);

  // Ref pour eviter les doubles initialisations en mode strict
  const initRef = useRef(false);

  // 1. Generer ou restaurer les cles hybrides au montage du composant
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      // Essayer de restaurer depuis sessionStorage
      if (roomId) {
        // D'abord verifier si on a une cle partagee
        const storedShared = await loadSharedKeyFromStorage(roomId);
        if (storedShared) {
          // On a deja une session etablie, restaurer tout
          const storedKeys = await loadKeysFromStorage(roomId);
          if (storedKeys) {
            setKeyPair(storedKeys.keyPair);
            setPublicKeys(storedKeys.publicKeys);
            setSharedKey(storedShared.sharedKey);
            setIsInitiator(storedShared.isInitiator);
            setKyberCiphertext(storedShared.kyberCiphertext);
            console.log('✅ Full encryption state restored from sessionStorage');
            return;
          }
        }

        // Sinon verifier si on a juste les cles (pas encore de shared key)
        const storedKeys = await loadKeysFromStorage(roomId);
        if (storedKeys) {
          setKeyPair(storedKeys.keyPair);
          setPublicKeys(storedKeys.publicKeys);
          console.log('✅ Key pair restored, waiting for key exchange');
          return;
        }
      }

      // Rien en storage, generer de nouvelles cles
      console.log('🔐 Generating hybrid key pair (ECDH + Kyber)...');
      const keys = await generateHybridKeyPair();
      setKeyPair(keys);
      console.log('✅ Key pair generated');

      // Exporter les cles publiques
      const exported = await exportHybridPublicKeys(keys);
      setPublicKeys(exported);
      console.log('✅ Public keys exported and ready to send');

      // Sauvegarder dans sessionStorage
      if (roomId) {
        await saveKeysToStorage(roomId, keys, exported);
      }
    };
    init();
  }, [roomId]);

  // 2. Recevoir les cles publiques de l'autre user et calculer la cle partagee
  const setOtherPublicKeys = useCallback(
    async (
      otherKeys: { ecdh: string; kyber: string },
      receivedKyberCiphertext?: string
    ) => {
      if (!keyPair) {
        throw new Error('Key pair not generated yet');
      }

      let shared: CryptoKey;
      let initiator: boolean;
      let ciphertext: string | null = null;

      if (receivedKyberCiphertext) {
        // Je suis le DESTINATAIRE (j'ai recu le ciphertext de l'initiateur)
        console.log('🔑 Deriving shared key as RESPONDER...');
        shared = await deriveHybridSharedKeyAsResponder(
          keyPair,
          otherKeys.ecdh,
          receivedKyberCiphertext
        );
        initiator = false;
        console.log('✅ Shared key derived as responder, encryption ready!');
      } else {
        // Je suis l'INITIATEUR (premier a recevoir les cles de l'autre)
        console.log('🔑 Deriving shared key as INITIATOR...');
        const result = await deriveHybridSharedKeyAsInitiator(
          keyPair,
          otherKeys.ecdh,
          otherKeys.kyber
        );
        shared = result.sharedKey;
        ciphertext = result.kyberCiphertext;
        initiator = true;
        console.log('✅ Shared key derived as initiator, encryption ready!');
      }

      setSharedKey(shared);
      setIsInitiator(initiator);
      setKyberCiphertext(ciphertext);

      // Sauvegarder la cle partagee
      if (roomId) {
        await saveSharedKeyToStorage(roomId, shared, initiator, ciphertext);
      }
    },
    [keyPair, roomId]
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

  // 5. Nettoyer les cles
  const clearKeys = useCallback(() => {
    if (roomId) {
      clearEncryptionKeys(roomId);
    }
  }, [roomId]);

  return {
    isReady: sharedKey !== null,
    publicKeys,
    isInitiator,
    kyberCiphertext,
    setOtherPublicKeys,
    encrypt,
    decrypt,
    clearKeys,
  };
}

// ============ HOOK LEGACY (COMPATIBILITE) ============

// Re-export du hook original pour compatibilite
// Tu peux supprimer ca une fois la migration terminee

import {
    deriveSharedKey,
    exportPublicKey,
    generateKeyPair,
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
