// lib/crypto/kyber.ts
// Wrapper pour le chiffrement post-quantique Kyber (ML-KEM)

import { KeyGen, Encapsulate, Decapsulate } from 'crystals-kyber';

/**
 * Paire de cles Kyber
 * - publicKey: cle publique a partager (1568 bytes pour Kyber1024)
 * - privateKey: cle privee a garder secrete (3168 bytes pour Kyber1024)
 */
export interface KyberKeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

/**
 * Resultat de l'encapsulation Kyber
 * - ciphertext: donnees chiffrees a envoyer a l'autre user
 * - sharedSecret: secret partage de 32 bytes
 */
export interface KyberEncapsulation {
  ciphertext: Uint8Array;
  sharedSecret: Uint8Array;
}

/**
 * Genere une paire de cles Kyber1024 (niveau de securite le plus eleve)
 * Kyber1024 = niveau de securite equivalent a AES-256
 */
export async function generateKyberKeyPair(): Promise<KyberKeyPair> {
  const [publicKey, privateKey] = await KeyGen();
  return { publicKey, privateKey };
}

/**
 * Encapsule un secret partage avec la cle publique de l'autre user
 * Utilise par l'initiateur de la connexion
 * @param otherPublicKey - Cle publique Kyber de l'autre user
 * @returns ciphertext (a envoyer) + sharedSecret (a garder)
 */
export async function kyberEncapsulate(
  otherPublicKey: Uint8Array
): Promise<KyberEncapsulation> {
  const [ciphertext, sharedSecret] = await Encapsulate(otherPublicKey);
  return { ciphertext, sharedSecret };
}

/**
 * Decapsule pour recuperer le secret partage
 * Utilise par le destinataire
 * @param ciphertext - Donnees recues de l'autre user
 * @param privateKey - Ta cle privee Kyber
 * @returns Le secret partage de 32 bytes
 */
export async function kyberDecapsulate(
  ciphertext: Uint8Array,
  privateKey: Uint8Array
): Promise<Uint8Array> {
  const sharedSecret = await Decapsulate(ciphertext, privateKey);
  return sharedSecret;
}

/**
 * Exporte une cle publique Kyber en base64
 */
export function exportKyberPublicKey(publicKey: Uint8Array): string {
  return btoa(String.fromCharCode(...publicKey));
}

/**
 * Importe une cle publique Kyber depuis base64
 */
export function importKyberPublicKey(base64Key: string): Uint8Array {
  return Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
}

/**
 * Exporte un ciphertext Kyber en base64
 */
export function exportKyberCiphertext(ciphertext: Uint8Array): string {
  return btoa(String.fromCharCode(...ciphertext));
}

/**
 * Importe un ciphertext Kyber depuis base64
 */
export function importKyberCiphertext(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
