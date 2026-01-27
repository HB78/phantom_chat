// lib/crypto/index.ts
// Export centralise de toutes les fonctions crypto

// ECDH classique (pour compatibilite)
export {
  generateKeyPair,
  deriveSharedKey,
  exportPublicKey,
  importPublicKey,
} from './key';

// Hybride ECDH + Kyber (post-quantique)
export {
  generateHybridKeyPair,
  exportHybridPublicKeys,
  deriveHybridSharedKeyAsInitiator,
  deriveHybridSharedKeyAsResponder,
  type HybridKeyPair,
  type ExportedPublicKeys,
} from './key';

// Kyber (post-quantique)
export {
  generateKyberKeyPair,
  kyberEncapsulate,
  kyberDecapsulate,
  exportKyberPublicKey,
  importKyberPublicKey,
  exportKyberCiphertext,
  importKyberCiphertext,
  type KyberKeyPair,
  type KyberEncapsulation,
} from './kyber';

// Chiffrement AES-256-GCM
export { encryptMessage, decryptMessage } from './encrypt';
