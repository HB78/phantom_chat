// lib/crypto/kyber.ts
// Wrapper pour le chiffrement post-quantique ML-KEM (anciennement Kyber)
// ML-KEM = Module-Lattice-Based Key-Encapsulation Mechanism (standard NIST 2024)

import { MlKem768 } from 'mlkem';

/**
 * Paire de cles ML-KEM
 * - publicKey: cle publique a partager
 * - privateKey: cle privee a garder secrete
 */
export interface KyberKeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

/**
 * Resultat de l'encapsulation ML-KEM
 * - ciphertext: donnees chiffrees a envoyer a l'autre user
 * - sharedSecret: secret partage de 32 bytes
 */
export interface KyberEncapsulation {
  ciphertext: Uint8Array;
  sharedSecret: Uint8Array;
}

/**
 * Genere une paire de cles ML-KEM-768 (niveau de securite recommande)
 * ML-KEM-768 = equivalent a AES-192 en securite
 */
export async function generateKyberKeyPair(): Promise<KyberKeyPair> {
  const kyber = new MlKem768();
  const [publicKey, privateKey] = await kyber.generateKeyPair();
  return { publicKey, privateKey };
}

/**
 * Encapsule un secret partage avec la cle publique de l'autre user
 * Utilise par l'initiateur de la connexion
 * @param otherPublicKey - Cle publique ML-KEM de l'autre user
 * @returns ciphertext (a envoyer) + sharedSecret (a garder)
 */
export async function kyberEncapsulate(
  otherPublicKey: Uint8Array
): Promise<KyberEncapsulation> {
  const kyber = new MlKem768();
  const [ciphertext, sharedSecret] = await kyber.encap(otherPublicKey);
  return { ciphertext, sharedSecret };
}

/**
 * Decapsule pour recuperer le secret partage
 * Utilise par le destinataire
 * @param ciphertext - Donnees recues de l'autre user
 * @param privateKey - Ta cle privee ML-KEM
 * @returns Le secret partage de 32 bytes
 */
export async function kyberDecapsulate(
  ciphertext: Uint8Array,
  privateKey: Uint8Array
): Promise<Uint8Array> {
  const kyber = new MlKem768();
  const sharedSecret = await kyber.decap(ciphertext, privateKey);
  return sharedSecret;
}

/**
 * Exporte une cle publique ML-KEM en base64
 */
export function exportKyberPublicKey(publicKey: Uint8Array): string {
  return btoa(String.fromCharCode(...publicKey));
}

/**
 * Importe une cle publique ML-KEM depuis base64
 */
export function importKyberPublicKey(base64Key: string): Uint8Array {
  return Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
}

/**
 * Exporte un ciphertext ML-KEM en base64
 */
export function exportKyberCiphertext(ciphertext: Uint8Array): string {
  return btoa(String.fromCharCode(...ciphertext));
}

/**
 * Importe un ciphertext ML-KEM depuis base64
 */
export function importKyberCiphertext(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
