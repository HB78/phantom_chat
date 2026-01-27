// lib/crypto/keys.ts

import {
  generateKyberKeyPair,
  kyberEncapsulate,
  kyberDecapsulate,
  exportKyberPublicKey,
  importKyberPublicKey,
  exportKyberCiphertext,
  importKyberCiphertext,
  type KyberKeyPair,
} from './kyber';

// ============ TYPES ============

/**
 * Paire de cles hybride (ECDH + Kyber)
 */
export interface HybridKeyPair {
  ecdh: CryptoKeyPair;
  kyber: KyberKeyPair;
}

/**
 * Cles publiques exportees en base64
 */
export interface ExportedPublicKeys {
  ecdh: string; // ~65 bytes en base64
  kyber: string; // ~1568 bytes en base64
}

// ============ ECDH (CLASSIQUE) ============

/**
 * Genere une paire de cles ECDH (Elliptic Curve Diffie-Hellman)
 * - Cle publique : peut etre partagee avec l'autre user
 * - Cle privee : reste secrete sur l'appareil
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true, // extractable = true pour pouvoir exporter la cle publique
    ['deriveKey', 'deriveBits'] // deriveBits necessaire pour le mode hybride
  );
}

/**
 * Derive une cle partagee AES-256-GCM a partir de l'echange ECDH
 * @param privateKey - Ta cle privee
 * @param publicKey - La cle publique de l'autre user
 * @returns Une cle AES-256-GCM pour chiffrer/dechiffrer les messages
 */
export async function deriveSharedKey(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  return await crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false, // non extractable pour la securite
    ['encrypt', 'decrypt']
  );
}

/**
 * Exporte une cle publique en base64 pour l'envoyer a l'autre user
 * @param publicKey - La cle publique a exporter
 * @returns La cle en format base64
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Importe une cle publique recue de l'autre user
 * @param base64Key - La cle publique en base64
 * @returns Un objet CryptoKey utilisable pour deriveSharedKey
 */
export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    []
  );
}

// ============ HYBRIDE (ECDH + KYBER) ============

/**
 * Genere une paire de cles hybride (ECDH + Kyber)
 * C'est la fonction principale a utiliser pour le chiffrement post-quantique
 */
export async function generateHybridKeyPair(): Promise<HybridKeyPair> {
  const [ecdh, kyber] = await Promise.all([
    generateKeyPair(),
    generateKyberKeyPair(),
  ]);
  return { ecdh, kyber };
}

/**
 * Exporte les cles publiques hybrides en base64
 */
export async function exportHybridPublicKeys(
  hybridKeyPair: HybridKeyPair
): Promise<ExportedPublicKeys> {
  const ecdhBase64 = await exportPublicKey(hybridKeyPair.ecdh.publicKey);
  const kyberBase64 = exportKyberPublicKey(hybridKeyPair.kyber.publicKey);
  return { ecdh: ecdhBase64, kyber: kyberBase64 };
}

/**
 * Combine deux secrets avec HKDF pour creer une cle AES-256
 * HKDF = HMAC-based Key Derivation Function
 */
async function combineSecretsWithHKDF(
  ecdhSecret: ArrayBuffer,
  kyberSecret: Uint8Array
): Promise<CryptoKey> {
  // Combiner les deux secrets
  const combined = new Uint8Array(ecdhSecret.byteLength + kyberSecret.length);
  combined.set(new Uint8Array(ecdhSecret), 0);
  combined.set(kyberSecret, ecdhSecret.byteLength);

  // Importer comme materiel de cle pour HKDF
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    combined,
    'HKDF',
    false,
    ['deriveKey']
  );

  // Deriver la cle finale AES-256-GCM avec HKDF
  const finalKey = await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('PhantomChat-Hybrid-E2E-v1'),
      info: new TextEncoder().encode('AES-256-GCM'),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, // non extractable
    ['encrypt', 'decrypt']
  );

  return finalKey;
}

/**
 * Derive la cle partagee hybride (INITIATEUR)
 * L'initiateur encapsule avec Kyber et derive avec ECDH
 *
 * @param myKeyPair - Ma paire de cles hybride
 * @param otherEcdhPublicKey - Cle publique ECDH de l'autre (base64)
 * @param otherKyberPublicKey - Cle publique Kyber de l'autre (base64)
 * @returns { sharedKey, kyberCiphertext } - La cle partagee et le ciphertext a envoyer
 */
export async function deriveHybridSharedKeyAsInitiator(
  myKeyPair: HybridKeyPair,
  otherEcdhPublicKey: string,
  otherKyberPublicKey: string
): Promise<{ sharedKey: CryptoKey; kyberCiphertext: string }> {
  // 1. ECDH: Deriver le secret classique
  const otherEcdh = await importPublicKey(otherEcdhPublicKey);
  const ecdhSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: otherEcdh },
    myKeyPair.ecdh.privateKey,
    256
  );

  // 2. Kyber: Encapsuler pour obtenir le secret post-quantique
  const otherKyber = importKyberPublicKey(otherKyberPublicKey);
  const { ciphertext, sharedSecret: kyberSecret } =
    await kyberEncapsulate(otherKyber);

  // 3. Combiner les deux secrets avec HKDF
  const sharedKey = await combineSecretsWithHKDF(ecdhSecret, kyberSecret);

  // 4. Retourner la cle et le ciphertext a envoyer
  return {
    sharedKey,
    kyberCiphertext: exportKyberCiphertext(ciphertext),
  };
}

/**
 * Derive la cle partagee hybride (DESTINATAIRE)
 * Le destinataire decapsule avec Kyber et derive avec ECDH
 *
 * @param myKeyPair - Ma paire de cles hybride
 * @param otherEcdhPublicKey - Cle publique ECDH de l'autre (base64)
 * @param kyberCiphertext - Ciphertext Kyber recu de l'initiateur (base64)
 * @returns La cle partagee AES-256-GCM
 */
export async function deriveHybridSharedKeyAsResponder(
  myKeyPair: HybridKeyPair,
  otherEcdhPublicKey: string,
  kyberCiphertext: string
): Promise<CryptoKey> {
  // 1. ECDH: Deriver le secret classique
  const otherEcdh = await importPublicKey(otherEcdhPublicKey);
  const ecdhSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: otherEcdh },
    myKeyPair.ecdh.privateKey,
    256
  );

  // 2. Kyber: Decapsuler pour obtenir le secret post-quantique
  const ciphertext = importKyberCiphertext(kyberCiphertext);
  const kyberSecret = await kyberDecapsulate(
    ciphertext,
    myKeyPair.kyber.privateKey
  );

  // 3. Combiner les deux secrets avec HKDF
  const sharedKey = await combineSecretsWithHKDF(ecdhSecret, kyberSecret);

  return sharedKey;
}
