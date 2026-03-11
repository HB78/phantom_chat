// lib/crypto/keys.ts

import { x25519 } from '@noble/curves/ed25519.js';
import {
  exportKyberCiphertext,
  exportKyberPublicKey,
  importKyberCiphertext,
  importKyberPublicKey,
  generateKyberKeyPair,
  kyberDecapsulate,
  kyberEncapsulate,
  type KyberKeyPair,
} from './kyber';

// ============ TYPES ============

/**
 * Paire de cles X25519
 */
export interface X25519KeyPair {
  publicKey: Uint8Array;  // 32 bytes
  privateKey: Uint8Array; // 32 bytes
}

/**
 * Paire de cles hybride (X25519 + Kyber)
 */
export interface HybridKeyPair {
  ecdh: X25519KeyPair;
  kyber: KyberKeyPair;
}

/**
 * Cles publiques exportees en base64
 */
export interface ExportedPublicKeys {
  ecdh: string;   // 32 bytes en base64 (X25519)
  kyber: string;  // ~1568 bytes en base64 (ML-KEM-768)
  dsa?: string;   // ~1312 bytes en base64 (ML-DSA-44) — optionnel pour compatibilité
}

// ============ X25519 ============

/**
 * Genere une paire de cles X25519
 * - Plus rapide que P-256
 * - Resistant aux attaques par timing
 * - Recommande par les cryptographes modernes
 */
export function generateKeyPair(): X25519KeyPair {
  const privateKey = x25519.utils.randomSecretKey();
  const publicKey = x25519.getPublicKey(privateKey);
  return { privateKey, publicKey };
}

/**
 * Derive le secret partage X25519
 * @param myPrivateKey - Ma cle privee X25519
 * @param otherPublicKey - La cle publique X25519 de l'autre user
 * @returns Le secret partage de 32 bytes
 */
export function deriveX25519Secret(
  myPrivateKey: Uint8Array,
  otherPublicKey: Uint8Array
): Uint8Array {
  return x25519.getSharedSecret(myPrivateKey, otherPublicKey);
}

/**
 * Exporte une cle publique X25519 en base64
 */
export function exportPublicKey(publicKey: Uint8Array): string {
  return btoa(String.fromCharCode(...publicKey));
}

/**
 * Importe une cle publique X25519 depuis base64
 */
export function importPublicKey(base64Key: string): Uint8Array {
  return Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
}

// ============ HYBRIDE (X25519 + KYBER) ============

/**
 * Genere une paire de cles hybride (X25519 + Kyber)
 */
export async function generateHybridKeyPair(): Promise<HybridKeyPair> {
  const ecdh = generateKeyPair();
  const kyber = await generateKyberKeyPair();
  return { ecdh, kyber };
}

/**
 * Exporte les cles publiques hybrides en base64
 * @param dsaPublicKey - Optionnel, cle publique ML-DSA a inclure
 */
export function exportHybridPublicKeys(
  hybridKeyPair: HybridKeyPair,
  dsaPublicKey?: Uint8Array
): ExportedPublicKeys {
  const keys: ExportedPublicKeys = {
    ecdh: exportPublicKey(hybridKeyPair.ecdh.publicKey),
    kyber: exportKyberPublicKey(hybridKeyPair.kyber.publicKey),
  };
  if (dsaPublicKey) {
    keys.dsa = btoa(String.fromCharCode(...dsaPublicKey));
  }
  return keys;
}

/**
 * Combine X25519 + Kyber secrets avec HKDF → 32 bytes bruts
 * Ce secret brut est utilisé comme rootKey du Double Ratchet
 */
async function combineRawSecrets(
  x25519Secret: Uint8Array,
  kyberSecret: Uint8Array
): Promise<Uint8Array> {
  const combined = new Uint8Array(x25519Secret.length + kyberSecret.length);
  combined.set(x25519Secret, 0);
  combined.set(kyberSecret, x25519Secret.length);

  const keyMaterial = await crypto.subtle.importKey(
    'raw', combined, 'HKDF', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('PhantomChat-Hybrid-E2E-v2'),
      info: new TextEncoder().encode('root-key'),
    },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

/**
 * Convertit un secret brut (32 bytes) en CryptoKey AES-256-GCM
 * Utilisé pour le fallback sans ratchet
 */
async function rawSecretToCryptoKey(secret: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw', secret.buffer as ArrayBuffer, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
  );
}

/**
 * Derive la cle partagee hybride (INITIATEUR)
 * Retourne aussi le secret brut pour initialiser le Double Ratchet
 */
export async function deriveHybridSharedKeyAsInitiator(
  myKeyPair: HybridKeyPair,
  otherEcdhPublicKey: string,
  otherKyberPublicKey: string
): Promise<{ sharedKey: CryptoKey; sharedSecret: Uint8Array; kyberCiphertext: string }> {
  const otherX25519 = importPublicKey(otherEcdhPublicKey);
  const x25519Secret = deriveX25519Secret(myKeyPair.ecdh.privateKey, otherX25519);

  const otherKyber = importKyberPublicKey(otherKyberPublicKey);
  const { ciphertext, sharedSecret: kyberSecret } = await kyberEncapsulate(otherKyber);

  const sharedSecret = await combineRawSecrets(x25519Secret, kyberSecret);
  const sharedKey = await rawSecretToCryptoKey(sharedSecret);

  return {
    sharedKey,
    sharedSecret,
    kyberCiphertext: exportKyberCiphertext(ciphertext),
  };
}

/**
 * Derive la cle partagee hybride (DESTINATAIRE)
 * Retourne aussi le secret brut pour initialiser le Double Ratchet
 */
export async function deriveHybridSharedKeyAsResponder(
  myKeyPair: HybridKeyPair,
  otherEcdhPublicKey: string,
  kyberCiphertext: string
): Promise<{ sharedKey: CryptoKey; sharedSecret: Uint8Array }> {
  const otherX25519 = importPublicKey(otherEcdhPublicKey);
  const x25519Secret = deriveX25519Secret(myKeyPair.ecdh.privateKey, otherX25519);

  const ciphertext = importKyberCiphertext(kyberCiphertext);
  const kyberSecret = await kyberDecapsulate(ciphertext, myKeyPair.kyber.privateKey);

  const sharedSecret = await combineRawSecrets(x25519Secret, kyberSecret);
  const sharedKey = await rawSecretToCryptoKey(sharedSecret);

  return { sharedKey, sharedSecret };
}
