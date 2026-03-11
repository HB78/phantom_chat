import {
    deriveHybridSharedKeyAsInitiator,
    deriveHybridSharedKeyAsResponder,
    exportHybridPublicKeys,
    generateHybridKeyPair,
    type ExportedPublicKeys,
    type HybridKeyPair,
    generateDSAKeyPair,
    importDSAPublicKey,
    exportDSAKeyPairForStorage,
    importDSAKeyPairFromStorage,
    signMessage,
    verifyMessage,
    type DSAKeyPair,
    type StoredDSAKeys,
    initRatchet,
    ratchetEncrypt,
    ratchetDecrypt,
    saveRatchetState,
    loadRatchetState,
    clearRatchetState,
    type RatchetState,
    type RatchetMessage,
} from '@/lib/crypto';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============ STORAGE KEYS ============
const STORAGE_KEY_PREFIX = 'phantom_keys_';
const STORAGE_SHARED_PREFIX = 'phantom_shared_';
const STORAGE_DSA_PREFIX = 'phantom_dsa_';

// ============ STORAGE HELPERS ============

interface StoredKeys {
  ecdh: {
    publicKey: string;
    privateKey: string;
  };
  kyber: {
    publicKey: string;
    privateKey: string;
  };
  publicKeysExported: ExportedPublicKeys;
}

function saveDSAKeysToStorage(roomId: string, dsaKeyPair: DSAKeyPair): void {
  const stored: StoredDSAKeys = exportDSAKeyPairForStorage(dsaKeyPair);
  localStorage.setItem(`${STORAGE_DSA_PREFIX}${roomId}`, JSON.stringify(stored));
}

function loadDSAKeysFromStorage(roomId: string): DSAKeyPair | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_DSA_PREFIX}${roomId}`);
    if (!stored) return null;
    return importDSAKeyPairFromStorage(JSON.parse(stored));
  } catch {
    return null;
  }
}

function saveOtherDSAPublicKey(roomId: string, key: Uint8Array): void {
  localStorage.setItem(`${STORAGE_DSA_PREFIX}${roomId}_other`, btoa(String.fromCharCode(...key)));
}

function loadOtherDSAPublicKey(roomId: string): Uint8Array | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_DSA_PREFIX}${roomId}_other`);
    if (!stored) return null;
    return Uint8Array.from(atob(stored), c => c.charCodeAt(0));
  } catch {
    return null;
  }
}

interface StoredSharedKey {
  key: JsonWebKey;
  isInitiator: boolean;
  kyberCiphertext: string | null;
}

async function saveKeysToStorage(roomId: string, keyPair: HybridKeyPair, publicKeys: ExportedPublicKeys): Promise<void> {
  try {
    const stored: StoredKeys = {
      ecdh: {
        publicKey: btoa(String.fromCharCode(...keyPair.ecdh.publicKey)),
        privateKey: btoa(String.fromCharCode(...keyPair.ecdh.privateKey)),
      },
      kyber: {
        publicKey: btoa(String.fromCharCode(...keyPair.kyber.publicKey)),
        privateKey: btoa(String.fromCharCode(...keyPair.kyber.privateKey)),
      },
      publicKeysExported: publicKeys,
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${roomId}`, JSON.stringify(stored));
  } catch {
    // silently fail
  }
}

function loadKeysFromStorage(roomId: string): { keyPair: HybridKeyPair; publicKeys: ExportedPublicKeys } | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${roomId}`);
    if (!stored) return null;

    const data: StoredKeys = JSON.parse(stored);

    return {
      keyPair: {
        ecdh: {
          publicKey: Uint8Array.from(atob(data.ecdh.publicKey), c => c.charCodeAt(0)),
          privateKey: Uint8Array.from(atob(data.ecdh.privateKey), c => c.charCodeAt(0)),
        },
        kyber: {
          publicKey: Uint8Array.from(atob(data.kyber.publicKey), c => c.charCodeAt(0)),
          privateKey: Uint8Array.from(atob(data.kyber.privateKey), c => c.charCodeAt(0)),
        },
      },
      publicKeys: data.publicKeysExported,
    };
  } catch {
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
    localStorage.setItem(`${STORAGE_SHARED_PREFIX}${roomId}`, JSON.stringify(stored));
  } catch {
    // silently fail
  }
}

async function loadSharedKeyFromStorage(roomId: string): Promise<StoredSharedKey & { sharedKey: CryptoKey } | null> {
  try {
    const stored = localStorage.getItem(`${STORAGE_SHARED_PREFIX}${roomId}`);
    if (!stored) return null;

    const data: StoredSharedKey = JSON.parse(stored);

    const sharedKey = await crypto.subtle.importKey(
      'jwk',
      data.key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return { key: data.key, sharedKey, isInitiator: data.isInitiator, kyberCiphertext: data.kyberCiphertext };
  } catch {
    return null;
  }
}

export function clearEncryptionKeys(roomId: string): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${roomId}`);
  localStorage.removeItem(`${STORAGE_SHARED_PREFIX}${roomId}`);
}

/**
 * Donnees de cles publiques echangees entre les deux users
 */
export interface HybridPublicKeyData {
  ecdh: string;
  kyber: string;
  kyberCiphertext?: string;
}

interface UseHybridEncryptionReturn {
  isReady: boolean;
  publicKeys: ExportedPublicKeys | null;
  isInitiator: boolean;
  kyberCiphertext: string | null;
  setOtherPublicKeys: (
    keys: { ecdh: string; kyber: string; dsa?: string },
    kyberCiphertext?: string
  ) => Promise<void>;
  updateOtherDsaKey: (dsaPublicKeyB64: string) => void;
  encrypt: (message: string) => Promise<{ ciphertext: string; signature: string }>;
  decrypt: (ciphertext: string, signature?: string) => Promise<string | null>;
  clearKeys: () => void;
}

export function useHybridEncryption(roomId?: string): UseHybridEncryptionReturn {
  const [keyPair, setKeyPair] = useState<HybridKeyPair | null>(null);
  const [publicKeys, setPublicKeys] = useState<ExportedPublicKeys | null>(null);
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [kyberCiphertext, setKyberCiphertext] = useState<string | null>(null);
  const [dsaKeyPair, setDsaKeyPair] = useState<DSAKeyPair | null>(null);
  const [otherDsaPublicKey, setOtherDsaPublicKey] = useState<Uint8Array | null>(null);
  const otherDsaPublicKeyRef = useRef<Uint8Array | null>(null);
  const ratchetRef = useRef<RatchetState | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      if (roomId) {
        const storedShared = await loadSharedKeyFromStorage(roomId);
        if (storedShared) {
          const storedKeys = loadKeysFromStorage(roomId);
          if (storedKeys) {
            setKeyPair(storedKeys.keyPair);
            setPublicKeys(storedKeys.publicKeys);
            setSharedKey(storedShared.sharedKey);
            setIsInitiator(storedShared.isInitiator);
            setKyberCiphertext(storedShared.kyberCiphertext);
            const storedDsa = loadDSAKeysFromStorage(roomId);
            if (storedDsa) setDsaKeyPair(storedDsa);
            const storedOtherDsa = loadOtherDSAPublicKey(roomId);
            if (storedOtherDsa) {
              setOtherDsaPublicKey(storedOtherDsa);
              otherDsaPublicKeyRef.current = storedOtherDsa;
            }
            const storedRatchet = loadRatchetState(roomId);
            if (storedRatchet) ratchetRef.current = storedRatchet;
            return;
          }
        }

        const storedKeys = loadKeysFromStorage(roomId);
        if (storedKeys) {
          setKeyPair(storedKeys.keyPair);
          setPublicKeys(storedKeys.publicKeys);
          const storedDsa = loadDSAKeysFromStorage(roomId);
          if (storedDsa) setDsaKeyPair(storedDsa);
          return;
        }
      }

      const keys = await generateHybridKeyPair();
      setKeyPair(keys);

      const dsa = generateDSAKeyPair();
      setDsaKeyPair(dsa);

      const exported = exportHybridPublicKeys(keys, dsa.publicKey);
      setPublicKeys(exported);

      if (roomId) {
        await saveKeysToStorage(roomId, keys, exported);
        saveDSAKeysToStorage(roomId, dsa);
      }
    };
    init();
  }, [roomId]);

  const setOtherPublicKeys = useCallback(
    async (
      otherKeys: { ecdh: string; kyber: string; dsa?: string },
      receivedKyberCiphertext?: string
    ) => {
      if (!keyPair) {
        throw new Error('Key pair not generated yet');
      }

      let shared: CryptoKey;
      let initiator: boolean;
      let ciphertext: string | null = null;
      let sharedSecret: Uint8Array;

      if (receivedKyberCiphertext) {
        const result = await deriveHybridSharedKeyAsResponder(
          keyPair, otherKeys.ecdh, receivedKyberCiphertext
        );
        shared = result.sharedKey;
        sharedSecret = result.sharedSecret;
        initiator = false;
      } else {
        const result = await deriveHybridSharedKeyAsInitiator(
          keyPair, otherKeys.ecdh, otherKeys.kyber
        );
        shared = result.sharedKey;
        sharedSecret = result.sharedSecret;
        ciphertext = result.kyberCiphertext;
        initiator = true;
      }

      const otherDHPublic = Uint8Array.from(atob(otherKeys.ecdh), c => c.charCodeAt(0));
      const ratchetState = await initRatchet(sharedSecret, initiator, otherDHPublic, keyPair.ecdh);
      ratchetRef.current = ratchetState;

      setSharedKey(shared);
      setIsInitiator(initiator);
      setKyberCiphertext(ciphertext);

      if (otherKeys.dsa) {
        const otherDsaKey = importDSAPublicKey(otherKeys.dsa);
        setOtherDsaPublicKey(otherDsaKey);
        otherDsaPublicKeyRef.current = otherDsaKey;
        if (roomId) saveOtherDSAPublicKey(roomId, otherDsaKey);
      }

      if (roomId) {
        await saveSharedKeyToStorage(roomId, shared, initiator, ciphertext);
        saveRatchetState(roomId, ratchetState);
      }
    },
    [keyPair, roomId]
  );

  const updateOtherDsaKey = useCallback((dsaPublicKeyB64: string) => {
    const key = importDSAPublicKey(dsaPublicKeyB64);
    setOtherDsaPublicKey(key);
    otherDsaPublicKeyRef.current = key;
    if (roomId) saveOtherDSAPublicKey(roomId, key);
  }, [roomId]);

  const encrypt = useCallback(
    async (message: string): Promise<{ ciphertext: string; signature: string }> => {
      if (!ratchetRef.current) throw new Error('Ratchet not initialized');
      if (!dsaKeyPair) throw new Error('DSA keys not ready');

      const { state: newState, message: ratchetMsg } = await ratchetEncrypt(
        ratchetRef.current,
        message
      );
      ratchetRef.current = newState;
      if (roomId) saveRatchetState(roomId, newState);

      const serialized = btoa(JSON.stringify(ratchetMsg));
      const signature = signMessage(serialized, dsaKeyPair.secretKey);

      return { ciphertext: serialized, signature };
    },
    [dsaKeyPair, roomId]
  );

  const decrypt = useCallback(
    async (ciphertext: string, signature?: string): Promise<string | null> => {
      if (!ratchetRef.current) throw new Error('Ratchet not initialized');

      const dsaKey = otherDsaPublicKeyRef.current;
      if (signature && dsaKey) {
        const isValid = verifyMessage(ciphertext, signature, dsaKey);
        if (!isValid) return null;
      }

      let ratchetMsg: RatchetMessage;
      try {
        ratchetMsg = JSON.parse(atob(ciphertext));
      } catch {
        throw new Error('Invalid ratchet message format');
      }

      const { state: newState, plaintext } = await ratchetDecrypt(
        ratchetRef.current,
        ratchetMsg
      );
      ratchetRef.current = newState;
      if (roomId) saveRatchetState(roomId, newState);

      return plaintext;
    },
    [otherDsaPublicKey, roomId]
  );

  const clearKeys = useCallback(() => {
    if (roomId) {
      clearEncryptionKeys(roomId);
      localStorage.removeItem(`${STORAGE_DSA_PREFIX}${roomId}`);
      localStorage.removeItem(`${STORAGE_DSA_PREFIX}${roomId}_other`);
      clearRatchetState(roomId);
    }
    ratchetRef.current = null;
  }, [roomId]);

  return {
    isReady: sharedKey !== null && ratchetRef.current !== null,
    publicKeys,
    isInitiator,
    kyberCiphertext,
    setOtherPublicKeys,
    updateOtherDsaKey,
    encrypt,
    decrypt,
    clearKeys,
  };
}

// ============ HOOK LEGACY (COMPATIBILITE) ============

import {
    exportPublicKey,
    generateKeyPair,
    importPublicKey,
    encryptMessage,
    decryptMessage,
} from '@/lib/crypto';
import { deriveX25519Secret } from '@/lib/crypto/key';

interface UseEncryptionReturn {
  isReady: boolean;
  publicKeyBase64: string | null;
  setOtherPublicKey: (key: string) => Promise<void>;
  encrypt: (message: string) => Promise<string>;
  decrypt: (encryptedMessage: string) => Promise<string>;
}

export function useEncryption(): UseEncryptionReturn {
  const [keyPair, setKeyPair] = useState<{ publicKey: Uint8Array; privateKey: Uint8Array } | null>(null);
  const [publicKeyBase64, setPublicKeyBase64] = useState<string | null>(null);
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const keys = generateKeyPair();
    setKeyPair(keys);
    setPublicKeyBase64(exportPublicKey(keys.publicKey));
  }, []);

  const setOtherPublicKey = useCallback(
    async (otherPublicKeyBase64: string) => {
      if (!keyPair) throw new Error('Key pair not generated yet');
      const otherPublicKey = importPublicKey(otherPublicKeyBase64);
      const x25519Secret = deriveX25519Secret(keyPair.privateKey, otherPublicKey);
      const keyMaterial = await crypto.subtle.importKey('raw', x25519Secret.buffer as ArrayBuffer, 'HKDF', false, ['deriveKey']);
      const shared = await crypto.subtle.deriveKey(
        { name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('PhantomChat-Hybrid-E2E-v2'), info: new TextEncoder().encode('AES-256-GCM') },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      setSharedKey(shared);
    },
    [keyPair]
  );

  const encrypt = useCallback(
    async (message: string): Promise<string> => {
      if (!sharedKey) throw new Error('Encryption not ready - no shared key');
      return encryptMessage(message, sharedKey);
    },
    [sharedKey]
  );

  const decrypt = useCallback(
    async (encryptedMessage: string): Promise<string> => {
      if (!sharedKey) throw new Error('Decryption not ready - no shared key');
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
