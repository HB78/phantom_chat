// lib/crypto/dsa.ts
// ML-DSA (FIPS 204) - Signatures numériques post-quantiques
// Garantit l'authenticité des messages - empêche les attaques MITM

import { ml_dsa44 } from '@noble/post-quantum/ml-dsa.js';

// ml_dsa44 = niveau de sécurité 2 (NIST)
// - Clé publique  : 1312 bytes
// - Clé secrète   : 2560 bytes
// - Signature     : 2420 bytes
// Suffisant pour une app de chat — ml_dsa65/87 sont plus lourds sans gain réel ici

export interface DSAKeyPair {
  publicKey: Uint8Array;  // 1312 bytes — à partager lors du handshake
  secretKey: Uint8Array;  // 2560 bytes — ne quitte jamais l'appareil
}

export interface StoredDSAKeys {
  publicKey: string; // base64
  secretKey: string; // base64
}

// ============ GÉNÉRATION ============

/**
 * Génère une paire de clés ML-DSA-44
 */
export function generateDSAKeyPair(): DSAKeyPair {
  return ml_dsa44.keygen();
}

// ============ EXPORT / IMPORT ============

export function exportDSAPublicKey(publicKey: Uint8Array): string {
  return btoa(String.fromCharCode(...publicKey));
}

export function importDSAPublicKey(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

export function exportDSAKeyPairForStorage(keyPair: DSAKeyPair): StoredDSAKeys {
  return {
    publicKey: btoa(String.fromCharCode(...keyPair.publicKey)),
    secretKey: btoa(String.fromCharCode(...keyPair.secretKey)),
  };
}

export function importDSAKeyPairFromStorage(stored: StoredDSAKeys): DSAKeyPair {
  return {
    publicKey: Uint8Array.from(atob(stored.publicKey), c => c.charCodeAt(0)),
    secretKey: Uint8Array.from(atob(stored.secretKey), c => c.charCodeAt(0)),
  };
}

// ============ SIGNATURE / VÉRIFICATION ============

/**
 * Signe un message chiffré avec la clé secrète DSA
 * @param ciphertext - Le message chiffré (base64) à signer
 * @param secretKey  - Ta clé secrète ML-DSA
 * @returns La signature en base64 (2420 bytes)
 */
export function signMessage(ciphertext: string, secretKey: Uint8Array): string {
  const data = new TextEncoder().encode(ciphertext);
  const signature = ml_dsa44.sign(data, secretKey);
  return btoa(String.fromCharCode(...signature));
}

/**
 * Vérifie la signature d'un message reçu
 * @param ciphertext      - Le message chiffré (base64) reçu
 * @param signatureBase64 - La signature reçue (base64)
 * @param publicKey       - La clé publique DSA de l'envoyeur
 * @returns true si authentique, false si falsifié
 */
export function verifyMessage(
  ciphertext: string,
  signatureBase64: string,
  publicKey: Uint8Array
): boolean {
  try {
    const data = new TextEncoder().encode(ciphertext);
    const signature = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    return ml_dsa44.verify(signature, data, publicKey);
  } catch {
    // Signature malformée = rejet immédiat
    return false;
  }
}
