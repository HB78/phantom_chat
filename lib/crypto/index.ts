// lib/crypto/index.ts
// Export centralise de toutes les fonctions crypto

// X25519 (pour compatibilite)
export {
  generateKeyPair,
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

// Double Ratchet
export {
  initRatchet,
  ratchetEncrypt,
  ratchetDecrypt,
  saveRatchetState,
  loadRatchetState,
  clearRatchetState,
  type RatchetState,
  type RatchetMessage,
  type RatchetHeader,
} from './ratchet';

// ML-DSA (signatures post-quantiques)
export {
  generateDSAKeyPair,
  exportDSAPublicKey,
  importDSAPublicKey,
  exportDSAKeyPairForStorage,
  importDSAKeyPairFromStorage,
  signMessage,
  verifyMessage,
  type DSAKeyPair,
  type StoredDSAKeys,
} from './dsa';
