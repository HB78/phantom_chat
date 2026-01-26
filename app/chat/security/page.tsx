import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security & Privacy - Phantom Chat',
  description:
    'How Phantom Chat protects your privacy: end-to-end encryption, zero-knowledge architecture, self-destructing messages, and no data retention. Complete security overview.',
  keywords: [
    'secure chat',
    'encrypted messaging',
    'privacy protection',
    'zero-knowledge',
    'anonymous chat',
    'E2E encryption',
  ],
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> SECURITY_PROTOCOL
          </h1>
          <p className="text-lg text-zinc-400">
            How Phantom Chat protects your privacy with military-grade security
          </p>
        </header>

        {/* TL;DR */}
        <section
          id="tldr"
          className="mb-12 border border-green-500/30 bg-green-500/5 p-6"
          aria-labelledby="tldr-heading"
        >
          <h2
            id="tldr-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">$</span> SECURITY_SUMMARY
          </h2>
          <ul className="space-y-2 font-mono text-sm text-zinc-300">
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">AES-256-GCM</strong> - Military-grade encryption
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">ECDH Key Exchange</strong> - Secure key negotiation
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">Zero-Knowledge</strong> - We can&apos;t read your data
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">Auto-Destruction</strong> - Data deleted on TTL expiry
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">No Logs</strong> - Zero IP or metadata retention
              </span>
            </li>
          </ul>
        </section>

        {/* Encryption Section */}
        <section className="mb-12" aria-labelledby="encryption-heading">
          <h2
            id="encryption-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> END_TO_END_ENCRYPTION
          </h2>

          <div className="mb-6 border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-3 font-mono text-lg font-semibold text-zinc-100">
              How It Works
            </h3>
            <p className="mb-4 text-zinc-400">
              Every message is encrypted in your browser before being sent. The encryption
              process uses the Web Crypto API with the following specifications:
            </p>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="text-green-600">$</span>
                <span className="ml-2 text-zinc-300">
                  Algorithm: <span className="text-green-400">AES-256-GCM</span>
                </span>
              </div>
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="text-green-600">$</span>
                <span className="ml-2 text-zinc-300">
                  Key Exchange: <span className="text-green-400">ECDH P-256</span>
                </span>
              </div>
              <div className="flex items-center border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="text-green-600">$</span>
                <span className="ml-2 text-zinc-300">
                  IV Size: <span className="text-green-400">96 bits (unique per message)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-3 font-mono text-lg font-semibold text-zinc-100">
              Key Exchange Process
            </h3>
            <ol className="ml-4 list-decimal space-y-3 text-zinc-400">
              <li>
                When you join a room, your browser generates a unique ECDH key pair locally
              </li>
              <li>
                Your public key is shared with the other participant through our server
              </li>
              <li>
                Both browsers compute an identical shared secret using ECDH
              </li>
              <li>
                This shared secret derives the AES-256 encryption key
              </li>
              <li>
                Private keys never leave your device - we only see public keys
              </li>
            </ol>
          </div>
        </section>

        {/* Zero Knowledge Section */}
        <section className="mb-12" aria-labelledby="zk-heading">
          <h2
            id="zk-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ZERO_KNOWLEDGE_ARCHITECTURE
          </h2>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Phantom Chat is designed so that we <strong className="text-zinc-200">cannot</strong> access
              your data, even if we wanted to:
            </p>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start">
                <span className="mr-3 text-red-400">[!]</span>
                <span>
                  <strong className="text-zinc-200">Messages:</strong> Encrypted before reaching our servers.
                  We only see random-looking ciphertext.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-400">[!]</span>
                <span>
                  <strong className="text-zinc-200">Encryption Keys:</strong> Generated and stored only in your
                  browser. Never transmitted in usable form.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-400">[!]</span>
                <span>
                  <strong className="text-zinc-200">User Identity:</strong> No accounts means no way to link
                  rooms to individuals.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-400">[!]</span>
                <span>
                  <strong className="text-zinc-200">IP Addresses:</strong> Not logged. We use token-based
                  authentication with no identifying metadata.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Destruction Section */}
        <section className="mb-12" aria-labelledby="destruction-heading">
          <h2
            id="destruction-heading"
            className="mb-6 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> DATA_DESTRUCTION
          </h2>

          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              All data is ephemeral by design. Destruction happens in two scenarios:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-amber-500/30 bg-amber-500/5 p-4">
                <h4 className="mb-2 font-mono text-sm font-bold text-amber-400">
                  TTL_EXPIRY
                </h4>
                <p className="text-sm text-zinc-400">
                  Each room has a countdown timer. When it reaches zero, the room and all
                  contents are automatically purged from Redis storage.
                </p>
              </div>
              <div className="border border-red-500/30 bg-red-500/5 p-4">
                <h4 className="mb-2 font-mono text-sm font-bold text-red-400">
                  MANUAL_DESTROY
                </h4>
                <p className="text-sm text-zinc-400">
                  Either participant can destroy the room instantly. This triggers immediate
                  deletion and notifies the other user.
                </p>
              </div>
            </div>
            <p className="mt-4 font-mono text-sm text-zinc-500">
              * Destruction is irreversible. We have no backups or recovery mechanisms.
            </p>
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
            QUESTIONS ABOUT SECURITY?
          </h2>
          <p className="mb-6 text-zinc-400">
            Check our FAQ or dive deeper into our encryption implementation
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/chat/faq"
              className="border border-green-500 bg-green-500/10 px-8 py-3 font-mono text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
            >
              [VIEW_FAQ]
            </Link>
            <Link
              href="/chat/encryption"
              className="border border-zinc-700 px-8 py-3 font-mono text-sm font-bold text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
            >
              [ENCRYPTION_DEEP_DIVE]
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
