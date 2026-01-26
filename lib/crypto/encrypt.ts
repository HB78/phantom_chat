// lib/crypto/encrypt.ts

/**
 * Chiffre un message avec AES-256-GCM
 * @param message - Le message en clair
 * @param sharedKey - La clé partagée dérivée de l'échange ECDH
 * @returns Le message chiffré en base64 (IV + ciphertext)
 */
export async function encryptMessage(
  message: string,
  sharedKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // Générer un IV unique pour chaque message (12 bytes pour GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Chiffrer avec AES-256-GCM
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    data
  );

  // Combiner IV + données chiffrées et encoder en base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Déchiffre un message chiffré avec AES-256-GCM
 * @param encryptedMessage - Le message chiffré en base64 (IV + ciphertext)
 * @param sharedKey - La clé partagée dérivée de l'échange ECDH
 * @returns Le message en clair
 */
export async function decryptMessage(
  encryptedMessage: string,
  sharedKey: CryptoKey
): Promise<string> {
  // Décoder le base64
  const combined = Uint8Array.from(atob(encryptedMessage), (c) =>
    c.charCodeAt(0)
  );

  // Extraire l'IV (12 premiers bytes) et le ciphertext (le reste)
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  // Déchiffrer
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    ciphertext
  );

  // Convertir en string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
