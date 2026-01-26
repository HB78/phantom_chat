import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How E2E Encryption Works - Phantom Chat',
  description:
    'Deep dive into Phantom Chat encryption: AES-256-GCM, ECDH key exchange, Web Crypto API implementation. Technical overview for security-conscious users.',
  keywords: [
    'E2E encryption explained',
    'AES-256-GCM',
    'ECDH key exchange',
    'end-to-end encryption',
    'Web Crypto API',
    'secure messaging',
  ],
};

export default function EncryptionPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> ENCRYPTION_PROTOCOL
          </h1>
          <p className="text-lg text-zinc-400">
            Technical deep dive into how Phantom Chat protects your messages
          </p>
          <nav className="mt-6" aria-label="Page sections">
            <ul className="flex flex-wrap justify-center gap-4 font-mono text-sm">
              <li>
                <a
                  href="#overview"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Overview]
                </a>
              </li>
              <li>
                <a
                  href="#key-exchange"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Key Exchange]
                </a>
              </li>
              <li>
                <a
                  href="#encryption"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Encryption]
                </a>
              </li>
              <li>
                <a
                  href="#flow"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Flow]
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {/* Overview */}
        <section id="overview" className="mb-12" aria-labelledby="overview-heading">
          <h2
            id="overview-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> OVERVIEW
          </h2>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Phantom Chat implements true end-to-end encryption using modern Web Crypto APIs.
              This means your messages are encrypted <strong className="text-zinc-200">in your browser</strong> before
              being sent, and can only be decrypted by the intended recipient.
            </p>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Encryption:</span>
                <span className="text-green-400">AES-256-GCM</span>
              </div>
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Key Exchange:</span>
                <span className="text-green-400">ECDH (P-256 curve)</span>
              </div>
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Key Derivation:</span>
                <span className="text-green-400">HKDF-SHA256</span>
              </div>
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">IV Generation:</span>
                <span className="text-green-400">96-bit random per message</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Exchange */}
        <section id="key-exchange" className="mb-12" aria-labelledby="keyex-heading">
          <h2
            id="keyex-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ECDH_KEY_EXCHANGE
          </h2>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Elliptic Curve Diffie-Hellman (ECDH) allows two parties to establish a shared
              secret over an insecure channel without ever transmitting the secret itself.
            </p>

            <h3 className="mb-3 font-mono text-lg font-semibold text-zinc-100">
              The Process:
            </h3>
            <ol className="ml-4 list-decimal space-y-4 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Key Generation:</strong> Each user generates an ECDH
                key pair (public + private) using the P-256 curve. This happens locally in the browser.
                <div className="mt-2 border-l-2 border-amber-500/50 bg-black/30 p-3 font-mono text-xs text-amber-400">
                  crypto.subtle.generateKey({'{'}name: &quot;ECDH&quot;, namedCurve: &quot;P-256&quot;{'}'})
                </div>
              </li>
              <li>
                <strong className="text-zinc-200">Public Key Exchange:</strong> Users exchange their
                public keys through the Phantom Chat server. The server only sees public keys (useless
                without the private counterpart).
              </li>
              <li>
                <strong className="text-zinc-200">Shared Secret Derivation:</strong> Each browser combines
                its private key with the other user&apos;s public key to compute an identical shared secret.
                <div className="mt-2 border-l-2 border-amber-500/50 bg-black/30 p-3 font-mono text-xs text-amber-400">
                  crypto.subtle.deriveBits({'{'}name: &quot;ECDH&quot;, public: otherKey{'}'}, myPrivateKey, 256)
                </div>
              </li>
              <li>
                <strong className="text-zinc-200">Key Derivation:</strong> The shared secret is passed
                through HKDF to derive the final AES-256 encryption key.
              </li>
            </ol>
          </div>

          <div className="mt-4 border border-green-500/30 bg-green-500/5 p-4">
            <p className="font-mono text-sm text-green-400">
              <span className="text-green-600">[NOTE]</span> The mathematical properties of ECDH ensure
              that even if an attacker intercepts both public keys, they cannot compute the shared
              secret without one of the private keys.
            </p>
          </div>
        </section>

        {/* AES Encryption */}
        <section id="encryption" className="mb-12" aria-labelledby="aes-heading">
          <h2
            id="aes-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> AES_256_GCM_ENCRYPTION
          </h2>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              AES-256-GCM (Galois/Counter Mode) is a symmetric encryption algorithm that provides
              both confidentiality and integrity. The &quot;256&quot; refers to the key size in bits.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-zinc-700 bg-black/20 p-4">
                <h4 className="mb-2 font-mono text-sm font-bold text-green-400">
                  ENCRYPTION
                </h4>
                <p className="text-sm text-zinc-400">
                  Each message is encrypted with a unique 96-bit Initialization Vector (IV).
                  This ensures identical messages produce different ciphertexts.
                </p>
              </div>
              <div className="border border-zinc-700 bg-black/20 p-4">
                <h4 className="mb-2 font-mono text-sm font-bold text-green-400">
                  AUTHENTICATION
                </h4>
                <p className="text-sm text-zinc-400">
                  GCM mode generates an authentication tag that detects any tampering.
                  Modified messages are rejected during decryption.
                </p>
              </div>
            </div>

            <div className="mt-4 font-mono text-sm">
              <p className="mb-2 text-zinc-500">Message format:</p>
              <div className="border-l-2 border-green-500/50 bg-black/30 p-3 text-green-400">
                [IV (12 bytes)] + [Ciphertext] + [Auth Tag (16 bytes)]
              </div>
            </div>
          </div>
        </section>

        {/* Flow Diagram */}
        <section id="flow" className="mb-12" aria-labelledby="flow-heading">
          <h2
            id="flow-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ENCRYPTION_FLOW
          </h2>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-4 font-mono text-sm">
              <div className="border-b border-zinc-800 pb-4">
                <p className="mb-2 text-zinc-500">1. USER_A sends message:</p>
                <div className="ml-4 space-y-1 text-zinc-400">
                  <p>
                    <span className="text-green-400">→</span> Generate random 96-bit IV
                  </p>
                  <p>
                    <span className="text-green-400">→</span> Encrypt plaintext with AES-256-GCM
                  </p>
                  <p>
                    <span className="text-green-400">→</span> Concatenate IV + ciphertext + tag
                  </p>
                  <p>
                    <span className="text-green-400">→</span> Base64 encode for transport
                  </p>
                  <p>
                    <span className="text-green-400">→</span> Send to server
                  </p>
                </div>
              </div>

              <div className="border-b border-zinc-800 pb-4">
                <p className="mb-2 text-zinc-500">2. SERVER relays:</p>
                <div className="ml-4 space-y-1 text-zinc-400">
                  <p>
                    <span className="text-amber-400">→</span> Receives encrypted blob
                  </p>
                  <p>
                    <span className="text-amber-400">→</span> Cannot decrypt (no key)
                  </p>
                  <p>
                    <span className="text-amber-400">→</span> Stores temporarily
                  </p>
                  <p>
                    <span className="text-amber-400">→</span> Forwards to USER_B
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-zinc-500">3. USER_B receives:</p>
                <div className="ml-4 space-y-1 text-zinc-400">
                  <p>
                    <span className="text-blue-400">→</span> Base64 decode
                  </p>
                  <p>
                    <span className="text-blue-400">→</span> Extract IV from first 12 bytes
                  </p>
                  <p>
                    <span className="text-blue-400">→</span> Decrypt with shared AES key
                  </p>
                  <p>
                    <span className="text-blue-400">→</span> Verify authentication tag
                  </p>
                  <p>
                    <span className="text-blue-400">→</span> Display plaintext
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Guarantees */}
        <section className="mb-12" aria-labelledby="guarantees-heading">
          <h2
            id="guarantees-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> SECURITY_GUARANTEES
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-green-500/30 bg-green-500/5 p-4">
              <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
                CONFIDENTIALITY
              </h3>
              <p className="text-sm text-zinc-400">
                Only parties with the shared key can read messages. 256-bit keys are
                computationally impossible to brute force.
              </p>
            </div>
            <div className="border border-green-500/30 bg-green-500/5 p-4">
              <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
                INTEGRITY
              </h3>
              <p className="text-sm text-zinc-400">
                GCM authentication tags detect any modification to the ciphertext.
                Tampered messages fail decryption.
              </p>
            </div>
            <div className="border border-green-500/30 bg-green-500/5 p-4">
              <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
                FORWARD SECRECY
              </h3>
              <p className="text-sm text-zinc-400">
                Each room generates new keys. Compromising one room doesn&apos;t affect
                past or future conversations.
              </p>
            </div>
            <div className="border border-green-500/30 bg-green-500/5 p-4">
              <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
                ZERO KNOWLEDGE
              </h3>
              <p className="text-sm text-zinc-400">
                Servers never see plaintext or encryption keys. We mathematically
                cannot access your messages.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="border border-green-500/30 bg-green-500/5 p-8 text-center"
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="mb-3 font-mono text-2xl font-bold text-green-400"
          >
            SEE IT IN ACTION
          </h2>
          <p className="mb-6 text-zinc-400">
            Experience military-grade encryption firsthand
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create"
              className="border border-green-500 bg-green-500/10 px-8 py-3 font-mono text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
            >
              [CREATE_SECURE_ROOM]
            </Link>
            <Link
              href="/chat/security"
              className="border border-zinc-700 px-8 py-3 font-mono text-sm font-bold text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
            >
              [SECURITY_OVERVIEW]
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
