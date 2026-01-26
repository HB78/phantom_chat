// lib/crypto/keys.ts

/**
 * Génère une paire de clés ECDH (Elliptic Curve Diffie-Hellman)
 * - Clé publique : peut être partagée avec l'autre user
 * - Clé privée : reste secrète sur l'appareil
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true, // extractable = true pour pouvoir exporter la clé publique
    ['deriveKey']
  );
}

/**
 * Dérive une clé partagée AES-256-GCM à partir de l'échange ECDH
 * @param privateKey - Ta clé privée
 * @param publicKey - La clé publique de l'autre user
 * @returns Une clé AES-256-GCM pour chiffrer/déchiffrer les messages
 */
export async function deriveSharedKey(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  return await crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false, // non extractable pour la sécurité
    ['encrypt', 'decrypt']
  );
}

/**
 * Exporte une clé publique en base64 pour l'envoyer à l'autre user
 * @param publicKey - La clé publique à exporter
 * @returns La clé en format base64
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Importe une clé publique reçue de l'autre user
 * @param base64Key - La clé publique en base64
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
