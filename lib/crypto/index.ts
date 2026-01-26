// lib/crypto/index.ts
// Export centralisé de toutes les fonctions crypto

export {
  generateKeyPair,
  deriveSharedKey,
  exportPublicKey,
  importPublicKey,
} from './key';

export { encryptMessage, decryptMessage } from './encrypt';
