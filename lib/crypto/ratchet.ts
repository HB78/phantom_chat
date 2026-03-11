// lib/crypto/ratchet.ts
// Double Ratchet Algorithm — inspiré du protocole Signal
// Fournit : Forward Secrecy + Break-in Recovery
//
// Fonctionnement :
//   - Ratchet symétrique (KDF) : chaque message consomme une Message Key unique et jetée
//   - Ratchet DH (X25519)      : à chaque "tour", les deux users renouvellent leurs clés DH
//                                 ce qui renouvelle toute la chaîne de dérivation
//
// État stocké 100% côté client dans localStorage — le serveur ne voit jamais les clés.

import { x25519 } from '@noble/curves/ed25519.js';

// ============ CONSTANTES ============

const SALT_ROOT    = 'PhantomChat-Ratchet-Root-v1';
const SALT_CHAIN   = 'PhantomChat-Ratchet-Chain-v1';
const SALT_MESSAGE = 'PhantomChat-Ratchet-Message-v1';
const MAX_SKIP     = 50; // Nombre max de messages qu'on accepte de "sauter" (out-of-order)

// ============ TYPES ============

/**
 * Header inclus dans chaque message chiffré
 * Permet à l'autre user de faire avancer son ratchet DH
 */
export interface RatchetHeader {
  dhPublicKey: string; // Clé publique X25519 courante de l'envoyeur (base64, 32 bytes)
  msgNum: number;      // Numéro du message dans la chaîne courante
  prevChainLen: number; // Longueur de la chaîne DH précédente (pour les messages out-of-order)
}

/**
 * Message chiffré avec le Double Ratchet
 */
export interface RatchetMessage {
  header: RatchetHeader;
  ciphertext: string; // Message chiffré AES-256-GCM (base64)
}

/**
 * État complet du Double Ratchet pour une session
 * Stocké dans localStorage, jamais envoyé au serveur
 */
export interface RatchetState {
  // Clé racine — renouvelée à chaque tour DH
  rootKey: Uint8Array;

  // Chaînes de clés
  sendChainKey: Uint8Array | null;
  recvChainKey: Uint8Array | null;

  // Paires DH X25519
  sendDHKeyPair: { publicKey: Uint8Array; privateKey: Uint8Array };
  recvDHPublicKey: Uint8Array | null; // Dernière clé DH reçue de l'autre

  // Compteurs
  sendMsgNum: number;
  recvMsgNum: number;
  prevSendChainLen: number; // Longueur de la chaîne d'envoi précédente

  // Clés sautées (messages reçus out-of-order)
  // Clé = "dhPublicKey:msgNum", Valeur = Message Key sérialisée en base64
  skippedKeys: Record<string, string>;
}

/**
 * Format de stockage dans localStorage (clés sérialisées en base64)
 */
export interface StoredRatchetState {
  rootKey: string;
  sendChainKey: string | null;
  recvChainKey: string | null;
  sendDHPublicKey: string;
  sendDHPrivateKey: string;
  recvDHPublicKey: string | null;
  sendMsgNum: number;
  recvMsgNum: number;
  prevSendChainLen: number;
  skippedKeys: Record<string, string>;
}

// ============ STORAGE ============

const STORAGE_RATCHET_PREFIX = 'phantom_ratchet_';

function u8ToB64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function b64ToU8(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export function saveRatchetState(roomId: string, state: RatchetState): void {
  const stored: StoredRatchetState = {
    rootKey: u8ToB64(state.rootKey),
    sendChainKey: state.sendChainKey ? u8ToB64(state.sendChainKey) : null,
    recvChainKey: state.recvChainKey ? u8ToB64(state.recvChainKey) : null,
    sendDHPublicKey: u8ToB64(state.sendDHKeyPair.publicKey),
    sendDHPrivateKey: u8ToB64(state.sendDHKeyPair.privateKey),
    recvDHPublicKey: state.recvDHPublicKey ? u8ToB64(state.recvDHPublicKey) : null,
    sendMsgNum: state.sendMsgNum,
    recvMsgNum: state.recvMsgNum,
    prevSendChainLen: state.prevSendChainLen,
    skippedKeys: state.skippedKeys,
  };
  localStorage.setItem(`${STORAGE_RATCHET_PREFIX}${roomId}`, JSON.stringify(stored));
}

export function loadRatchetState(roomId: string): RatchetState | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_RATCHET_PREFIX}${roomId}`);
    if (!raw) return null;
    const s: StoredRatchetState = JSON.parse(raw);
    return {
      rootKey: b64ToU8(s.rootKey),
      sendChainKey: s.sendChainKey ? b64ToU8(s.sendChainKey) : null,
      recvChainKey: s.recvChainKey ? b64ToU8(s.recvChainKey) : null,
      sendDHKeyPair: {
        publicKey: b64ToU8(s.sendDHPublicKey),
        privateKey: b64ToU8(s.sendDHPrivateKey),
      },
      recvDHPublicKey: s.recvDHPublicKey ? b64ToU8(s.recvDHPublicKey) : null,
      sendMsgNum: s.sendMsgNum,
      recvMsgNum: s.recvMsgNum,
      prevSendChainLen: s.prevSendChainLen,
      skippedKeys: s.skippedKeys,
    };
  } catch {
    return null;
  }
}

export function clearRatchetState(roomId: string): void {
  localStorage.removeItem(`${STORAGE_RATCHET_PREFIX}${roomId}`);
}

// ============ HKDF (WebCrypto) ============

/**
 * Dérive N bytes depuis un secret avec HKDF-SHA256
 */
async function hkdf(
  secret: Uint8Array,
  salt: string,
  info: string,
  length: number
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', secret.buffer as ArrayBuffer, 'HKDF', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode(salt),
      info: new TextEncoder().encode(info),
    },
    keyMaterial,
    length * 8
  );
  return new Uint8Array(bits);
}

// ============ KDF RATCHET ============

/**
 * KDF Root — fait avancer le ratchet DH
 * Prend la Root Key + un DH secret → produit une nouvelle Root Key + une Chain Key
 */
async function kdfRoot(
  rootKey: Uint8Array,
  dhSecret: Uint8Array
): Promise<{ newRootKey: Uint8Array; chainKey: Uint8Array }> {
  // Combiner rootKey + dhSecret comme input
  const input = new Uint8Array(rootKey.length + dhSecret.length);
  input.set(rootKey);
  input.set(dhSecret, rootKey.length);

  const derived = await hkdf(input, SALT_ROOT, 'root-chain', 64);
  return {
    newRootKey: derived.slice(0, 32),
    chainKey: derived.slice(32, 64),
  };
}

/**
 * KDF Chain — fait avancer le ratchet symétrique
 * Prend une Chain Key → produit une Message Key + une nouvelle Chain Key
 */
async function kdfChain(
  chainKey: Uint8Array
): Promise<{ messageKey: Uint8Array; nextChainKey: Uint8Array }> {
  const [messageKey, nextChainKey] = await Promise.all([
    hkdf(chainKey, SALT_MESSAGE, 'message-key', 32),
    hkdf(chainKey, SALT_CHAIN, 'chain-key', 32),
  ]);
  return { messageKey, nextChainKey };
}

// ============ AES-256-GCM ============

async function aesEncrypt(plaintext: string, key: Uint8Array): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key.buffer as ArrayBuffer, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(plaintext);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data);

  // IV (12 bytes) + ciphertext
  const combined = new Uint8Array(12 + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), 12);
  return btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(ciphertextB64: string, key: Uint8Array): Promise<string> {
  const combined = b64ToU8(ciphertextB64);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', key.buffer as ArrayBuffer, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
  );
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext);
  return new TextDecoder().decode(decrypted);
}

// ============ INITIALISATION ============

/**
 * Initialise l'état du Double Ratchet à partir de la clé partagée du handshake
 *
 * @param sharedSecret  - Secret partagé issu du handshake X25519+Kyber (32 bytes)
 * @param isInitiator   - true si tu es l'initiateur du handshake
 * @param otherDHPublic - Clé publique DH X25519 de l'autre (reçue pendant le handshake)
 */
export async function initRatchet(
  sharedSecret: Uint8Array,
  isInitiator: boolean,
  otherDHPublic: Uint8Array
): Promise<RatchetState> {
  // Générer notre première paire DH de ratchet
  const sendDHPrivateKey = x25519.utils.randomSecretKey();
  const sendDHPublicKey = x25519.getPublicKey(sendDHPrivateKey);

  let rootKey = sharedSecret;
  let sendChainKey: Uint8Array | null = null;
  let recvDHPublicKey: Uint8Array | null = null;

  // Les deux users font un tour DH initial pour initialiser leur sendChainKey
  const dhSecret = x25519.getSharedSecret(sendDHPrivateKey, otherDHPublic);
  const derived = await kdfRoot(rootKey, dhSecret);
  rootKey = derived.newRootKey;
  sendChainKey = derived.chainKey;
  recvDHPublicKey = otherDHPublic;

  return {
    rootKey,
    sendChainKey,
    recvChainKey: null,
    sendDHKeyPair: { publicKey: sendDHPublicKey, privateKey: sendDHPrivateKey },
    recvDHPublicKey,
    sendMsgNum: 0,
    recvMsgNum: 0,
    prevSendChainLen: 0,
    skippedKeys: {},
  };
}

// ============ CHIFFREMENT ============

/**
 * Chiffre un message avec le Double Ratchet
 * Fait avancer le ratchet symétrique d'un cran
 *
 * @returns { header, ciphertext } à envoyer
 */
export async function ratchetEncrypt(
  state: RatchetState,
  plaintext: string
): Promise<{ state: RatchetState; message: RatchetMessage }> {
  if (!state.sendChainKey) {
    throw new Error('Send chain not initialized');
  }

  // Avancer le ratchet symétrique → obtenir la Message Key
  const { messageKey, nextChainKey } = await kdfChain(state.sendChainKey);

  const header: RatchetHeader = {
    dhPublicKey: u8ToB64(state.sendDHKeyPair.publicKey),
    msgNum: state.sendMsgNum,
    prevChainLen: state.prevSendChainLen,
  };

  const ciphertext = await aesEncrypt(plaintext, messageKey);

  const newState: RatchetState = {
    ...state,
    sendChainKey: nextChainKey,
    sendMsgNum: state.sendMsgNum + 1,
  };

  return { state: newState, message: { header, ciphertext } };
}

// ============ DÉCHIFFREMENT ============

/**
 * Met de côté les Message Keys des messages qu'on a sautés
 * (nécessaire pour les messages reçus out-of-order)
 */
async function skipMessageKeys(
  state: RatchetState,
  until: number
): Promise<RatchetState> {
  if (!state.recvChainKey) return state;
  if (until - state.recvMsgNum > MAX_SKIP) {
    throw new Error(`Too many skipped messages: ${until - state.recvMsgNum}`);
  }

  let chainKey = state.recvChainKey;
  const skippedKeys = { ...state.skippedKeys };
  let msgNum = state.recvMsgNum;

  while (msgNum < until) {
    const { messageKey, nextChainKey } = await kdfChain(chainKey);
    const cacheKey = `${u8ToB64(state.recvDHPublicKey!)}:${msgNum}`;
    skippedKeys[cacheKey] = u8ToB64(messageKey);
    chainKey = nextChainKey;
    msgNum++;
  }

  return { ...state, recvChainKey: chainKey, skippedKeys };
}

/**
 * Fait avancer le ratchet DH (nouveau tour)
 * Appelé quand on reçoit une nouvelle clé DH de l'autre user
 */
async function dhRatchetStep(
  state: RatchetState,
  newRemoteDHPublic: Uint8Array
): Promise<RatchetState> {
  // Mettre de côté les clés sautées de la chaîne courante
  const stateAfterSkip = await skipMessageKeys(state, state.prevSendChainLen);

  // Tour DH de réception : dériver recv chain key
  const dhRecvSecret = x25519.getSharedSecret(state.sendDHKeyPair.privateKey, newRemoteDHPublic);
  const { newRootKey: rootKey1, chainKey: recvChainKey } = await kdfRoot(stateAfterSkip.rootKey, dhRecvSecret);

  // Générer une nouvelle paire DH d'envoi
  const newSendPrivate = x25519.utils.randomSecretKey();
  const newSendPublic = x25519.getPublicKey(newSendPrivate);

  // Tour DH d'envoi : dériver send chain key
  const dhSendSecret = x25519.getSharedSecret(newSendPrivate, newRemoteDHPublic);
  const { newRootKey: rootKey2, chainKey: sendChainKey } = await kdfRoot(rootKey1, dhSendSecret);

  return {
    ...stateAfterSkip,
    rootKey: rootKey2,
    sendChainKey,
    recvChainKey,
    sendDHKeyPair: { publicKey: newSendPublic, privateKey: newSendPrivate },
    recvDHPublicKey: newRemoteDHPublic,
    prevSendChainLen: state.sendMsgNum,
    sendMsgNum: 0,
    recvMsgNum: 0,
  };
}

/**
 * Déchiffre un message reçu avec le Double Ratchet
 * Gère automatiquement : nouveau tour DH, messages out-of-order
 *
 * @returns { state, plaintext }
 */
export async function ratchetDecrypt(
  state: RatchetState,
  message: RatchetMessage
): Promise<{ state: RatchetState; plaintext: string }> {
  const { header, ciphertext } = message;
  const headerDHPublic = b64ToU8(header.dhPublicKey);

  // 1. Vérifier si c'est un message qu'on a sauté (out-of-order)
  const skippedKey = `${header.dhPublicKey}:${header.msgNum}`;
  if (state.skippedKeys[skippedKey]) {
    const messageKey = b64ToU8(state.skippedKeys[skippedKey]);
    const newSkipped = { ...state.skippedKeys };
    delete newSkipped[skippedKey];
    const plaintext = await aesDecrypt(ciphertext, messageKey);
    return { state: { ...state, skippedKeys: newSkipped }, plaintext };
  }

  // 2. Nouveau tour DH si la clé DH du header est différente de celle qu'on connaît
  let currentState = state;
  const isDHNew = !state.recvDHPublicKey ||
    u8ToB64(state.recvDHPublicKey) !== header.dhPublicKey;

  if (isDHNew) {
    // Mettre de côté les messages sautés de la chaîne précédente
    currentState = await skipMessageKeys(currentState, header.prevChainLen);
    // Faire avancer le ratchet DH
    currentState = await dhRatchetStep(currentState, headerDHPublic);
  }

  // 3. Mettre de côté les messages sautés dans la chaîne courante
  currentState = await skipMessageKeys(currentState, header.msgNum);

  // 4. Dériver la Message Key et déchiffrer
  if (!currentState.recvChainKey) {
    throw new Error('Receive chain not initialized');
  }
  const { messageKey, nextChainKey } = await kdfChain(currentState.recvChainKey);
  const plaintext = await aesDecrypt(ciphertext, messageKey);

  const finalState: RatchetState = {
    ...currentState,
    recvChainKey: nextChainKey,
    recvMsgNum: currentState.recvMsgNum + 1,
  };

  return { state: finalState, plaintext };
}
