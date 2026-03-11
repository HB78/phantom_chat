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
    publicKey: string; // base64 (X25519, 32 bytes)
    privateKey: string; // base64 (X25519, 32 bytes)
  };
  kyber: {
    publicKey: string; // base64
    privateKey: string; // base64
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
    console.log('💾 Keys saved to localStorage');
  } catch (err) {
    console.error('Failed to save keys to storage:', err);
  }
}

function loadKeysFromStorage(roomId: string): { keyPair: HybridKeyPair; publicKeys: ExportedPublicKeys } | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${roomId}`);
    if (!stored) return null;

    const data: StoredKeys = JSON.parse(stored);

    const ecdhPublicKey = Uint8Array.from(atob(data.ecdh.publicKey), c => c.charCodeAt(0));
    const ecdhPrivateKey = Uint8Array.from(atob(data.ecdh.privateKey), c => c.charCodeAt(0));
    const kyberPublicKey = Uint8Array.from(atob(data.kyber.publicKey), c => c.charCodeAt(0));
    const kyberPrivateKey = Uint8Array.from(atob(data.kyber.privateKey), c => c.charCodeAt(0));

    console.log('📂 Keys restored from localStorage');

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
    localStorage.setItem(`${STORAGE_SHARED_PREFIX}${roomId}`, JSON.stringify(stored));
    console.log('💾 Shared key saved to localStorage');
  } catch (err) {
    console.error('Failed to save shared key:', err);
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

    console.log('📂 Shared key restored from localStorage');

    return { key: data.key, sharedKey, isInitiator: data.isInitiator, kyberCiphertext: data.kyberCiphertext };
  } catch (err) {
    console.error('Failed to load shared key:', err);
    return null;
  }
}

export function clearEncryptionKeys(roomId: string): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${roomId}`);
  localStorage.removeItem(`${STORAGE_SHARED_PREFIX}${roomId}`);
  console.log('🗑️ Encryption keys cleared from localStorage');
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
  /** Tes cles publiques en base64 a envoyer a l'autre user (ecdh + kyber + dsa) */
  publicKeys: ExportedPublicKeys | null;
  /** true si tu es l'initiateur (premier a recevoir la cle de l'autre) */
  isInitiator: boolean;
  /** Ciphertext Kyber a envoyer (seulement pour l'initiateur) */
  kyberCiphertext: string | null;
  setOtherPublicKeys: (
    keys: { ecdh: string; kyber: string; dsa?: string },
    kyberCiphertext?: string
  ) => Promise<void>;
  /** Met à jour uniquement la clé DSA de l'autre user (sans réinitialiser le ratchet) */
  updateOtherDsaKey: (dsaPublicKeyB64: string) => void;
  /** Chiffre un message et retourne { ciphertext, signature } */
  encrypt: (message: string) => Promise<{ ciphertext: string; signature: string }>;
  decrypt: (ciphertext: string, signature?: string) => Promise<string | null>;
  /** Nettoie les cles stockees */
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

  // Ref pour eviter les doubles initialisations en mode strict
  const initRef = useRef(false);

  // 1. Generer ou restaurer les cles hybrides au montage du composant
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      // Essayer de restaurer depuis localStorage
      if (roomId) {
        // D'abord verifier si on a une cle partagee
        const storedShared = await loadSharedKeyFromStorage(roomId);
        if (storedShared) {
          // On a deja une session etablie, restaurer tout
          const storedKeys = loadKeysFromStorage(roomId);
          if (storedKeys) {
            setKeyPair(storedKeys.keyPair);
            setPublicKeys(storedKeys.publicKeys);
            setSharedKey(storedShared.sharedKey);
            setIsInitiator(storedShared.isInitiator);
            setKyberCiphertext(storedShared.kyberCiphertext);
            const storedDsa = loadDSAKeysFromStorage(roomId);
            if (storedDsa) setDsaKeyPair(storedDsa);
            // Restaurer la clé DSA de l'autre user
            const storedOtherDsa = loadOtherDSAPublicKey(roomId);
            if (storedOtherDsa) {
              setOtherDsaPublicKey(storedOtherDsa);
              otherDsaPublicKeyRef.current = storedOtherDsa;
            }
            // Restaurer le ratchet
            const storedRatchet = loadRatchetState(roomId);
            if (storedRatchet) ratchetRef.current = storedRatchet;
            console.log('✅ Full encryption state restored from localStorage');
            return;
          }
        }

        // Sinon verifier si on a juste les cles (pas encore de shared key)
        const storedKeys = loadKeysFromStorage(roomId);
        if (storedKeys) {
          setKeyPair(storedKeys.keyPair);
          setPublicKeys(storedKeys.publicKeys);
          const storedDsa = loadDSAKeysFromStorage(roomId);
          if (storedDsa) setDsaKeyPair(storedDsa);
          console.log('✅ Key pair restored, waiting for key exchange');
          return;
        }
      }

      // Rien en storage, generer de nouvelles cles
      console.log('🔐 Generating hybrid key pair (X25519 + Kyber + ML-DSA)...');
      const keys = await generateHybridKeyPair();
      setKeyPair(keys);

      // Generer les cles DSA
      const dsa = generateDSAKeyPair();
      setDsaKeyPair(dsa);

      // Exporter les cles publiques avec DSA
      const exported = exportHybridPublicKeys(keys, dsa.publicKey);
      setPublicKeys(exported);
      console.log('✅ Key pairs generated and ready to send');

      // Sauvegarder dans localStorage
      if (roomId) {
        await saveKeysToStorage(roomId, keys, exported);
        saveDSAKeysToStorage(roomId, dsa);
      }
    };
    init();
  }, [roomId]);

  // 2. Recevoir les cles publiques de l'autre user et calculer la cle partagee
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
        console.log('🔑 Deriving shared key as RESPONDER...');
        const result = await deriveHybridSharedKeyAsResponder(
          keyPair, otherKeys.ecdh, receivedKyberCiphertext
        );
        shared = result.sharedKey;
        sharedSecret = result.sharedSecret;
        initiator = false;
        console.log('✅ Shared key derived as responder');
      } else {
        console.log('🔑 Deriving shared key as INITIATOR...');
        const result = await deriveHybridSharedKeyAsInitiator(
          keyPair, otherKeys.ecdh, otherKeys.kyber
        );
        shared = result.sharedKey;
        sharedSecret = result.sharedSecret;
        ciphertext = result.kyberCiphertext;
        initiator = true;
        console.log('✅ Shared key derived as initiator');
      }

      // Initialiser le Double Ratchet avec la cle partagee + cle DH de l'autre
      const otherDHPublic = Uint8Array.from(atob(otherKeys.ecdh), c => c.charCodeAt(0));
      const ratchetState = await initRatchet(sharedSecret, initiator, otherDHPublic);
      ratchetRef.current = ratchetState;
      console.log('✅ Double Ratchet initialized');

      setSharedKey(shared);
      setIsInitiator(initiator);
      setKyberCiphertext(ciphertext);

      // Stocker la cle publique DSA de l'autre
      if (otherKeys.dsa) {
        const otherDsaKey = importDSAPublicKey(otherKeys.dsa);
        setOtherDsaPublicKey(otherDsaKey);
        otherDsaPublicKeyRef.current = otherDsaKey;
        if (roomId) saveOtherDSAPublicKey(roomId, otherDsaKey);
      }

      // Sauvegarder
      if (roomId) {
        await saveSharedKeyToStorage(roomId, shared, initiator, ciphertext);
        saveRatchetState(roomId, ratchetState);
      }
    },
    [keyPair, roomId]
  );

  // 2b. Mettre à jour uniquement la clé DSA de l'autre (sans toucher au ratchet)
  const updateOtherDsaKey = useCallback((dsaPublicKeyB64: string) => {
    const key = importDSAPublicKey(dsaPublicKeyB64);
    setOtherDsaPublicKey(key);
    otherDsaPublicKeyRef.current = key;
    if (roomId) saveOtherDSAPublicKey(roomId, key);
  }, [roomId]);

  // 3. Chiffrer avec Double Ratchet + signer avec ML-DSA
  const encrypt = useCallback(
    async (message: string): Promise<{ ciphertext: string; signature: string }> => {
      if (!ratchetRef.current) {
        throw new Error('Ratchet not initialized');
      }
      if (!dsaKeyPair) {
        throw new Error('DSA keys not ready');
      }

      // Chiffrer avec le ratchet (fait avancer le ratchet symétrique)
      const { state: newState, message: ratchetMsg } = await ratchetEncrypt(
        ratchetRef.current,
        message
      );
      ratchetRef.current = newState;

      // Sauvegarder le nouvel état ratchet
      if (roomId) saveRatchetState(roomId, newState);

      // Sérialiser le message ratchet (header + ciphertext) en JSON base64
      const serialized = btoa(JSON.stringify(ratchetMsg));

      // Signer le message sérialisé avec ML-DSA
      const signature = signMessage(serialized, dsaKeyPair.secretKey);

      return { ciphertext: serialized, signature };
    },
    [dsaKeyPair, roomId]
  );

  // 4. Vérifier la signature ML-DSA + déchiffrer avec Double Ratchet
  const decrypt = useCallback(
    async (ciphertext: string, signature?: string): Promise<string | null> => {
      if (!ratchetRef.current) {
        throw new Error('Ratchet not initialized');
      }

      // Vérifier la signature ML-DSA si disponible
      const dsaKey = otherDsaPublicKeyRef.current;
      if (signature && dsaKey) {
        const isValid = verifyMessage(ciphertext, signature, dsaKey);
        if (!isValid) {
          console.warn('❌ Invalid DSA signature — message rejected');
          return null;
        }
      }

      // Désérialiser le message ratchet
      let ratchetMsg: RatchetMessage;
      try {
        ratchetMsg = JSON.parse(atob(ciphertext));
      } catch {
        throw new Error('Invalid ratchet message format');
      }

      // Déchiffrer avec le ratchet (fait avancer le ratchet de réception)
      const { state: newState, plaintext } = await ratchetDecrypt(
        ratchetRef.current,
        ratchetMsg
      );
      ratchetRef.current = newState;

      // Sauvegarder le nouvel état ratchet
      if (roomId) saveRatchetState(roomId, newState);

      return plaintext;
    },
    [otherDsaPublicKey, roomId]
  );

  // 5. Nettoyer les cles
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

// Re-export du hook original pour compatibilite
// Tu peux supprimer ca une fois la migration terminee

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
      if (!keyPair) {
        throw new Error('Key pair not generated yet');
      }
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
