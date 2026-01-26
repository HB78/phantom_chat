import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Phantom Chat',
  description:
    'Frequently asked questions about Phantom Chat: how it works, security, encryption, self-destructing rooms, and privacy. All answers you need.',
  keywords: [
    'Phantom Chat FAQ',
    'secure chat questions',
    'encrypted messaging help',
    'self-destructing chat',
    'anonymous chat FAQ',
  ],
  openGraph: {
    title: 'FAQ - Phantom Chat',
    description:
      'All your questions answered about Phantom Chat, the self-destructing encrypted chat platform.',
  },
};

const faqs = [
  {
    question: 'What is Phantom Chat?',
    answer:
      'Phantom Chat is a secure, self-destructing chat platform that enables truly private conversations. Create a room, share the link, and chat with end-to-end encryption. When the timer expires or you destroy the room, all messages are permanently deleted. No accounts, no logs, no traces.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. Phantom Chat requires zero registration. Simply click "Create Room", share the generated link with your contact, and start chatting immediately. We never ask for email, phone, or any personal information. Your privacy is absolute.',
  },
  {
    question: 'How does self-destruction work?',
    answer:
      'Each room has a Time-To-Live (TTL) countdown. When the timer reaches zero, the room and ALL its contents are permanently deleted from our servers. You can also manually destroy a room at any time using the "Destroy Room" button. Once destroyed, data cannot be recovered - by anyone, including us.',
  },
  {
    question: 'Is Phantom Chat really encrypted?',
    answer:
      'Yes. Phantom Chat uses AES-256-GCM end-to-end encryption. Encryption keys are generated locally in your browser and exchanged directly with your chat partner using ECDH key exchange. We never see your encryption keys or message contents. Even if our servers were compromised, your messages would remain unreadable.',
  },
  {
    question: 'How many people can join a room?',
    answer:
      'Currently, each room supports 2 participants maximum. This ensures true peer-to-peer encryption without the complexity of group key management. We may add secure group chat in the future while maintaining our zero-knowledge architecture.',
  },
  {
    question: 'What happens if I lose the room link?',
    answer:
      'If you lose the room link and have no other way to access it, the room becomes inaccessible. We cannot recover or reset room links. This is by design - we have no way to identify which rooms belong to which users. Always save your room links securely.',
  },
  {
    question: 'Can Phantom Chat read my messages?',
    answer:
      'No. Due to our end-to-end encryption architecture, messages are encrypted in your browser before being sent. We only see encrypted data that appears as random characters. Without your encryption keys (which never leave your device), decryption is mathematically impossible.',
  },
  {
    question: 'Is Phantom Chat free?',
    answer:
      'Yes, Phantom Chat is completely free to use. No premium tiers, no ads, no hidden costs. Our mission is to provide secure communication for everyone. The project is open-source and funded by donations.',
  },
  {
    question: 'What data do you store?',
    answer:
      'We store only the minimum required for the chat to function: encrypted messages (unreadable to us), room metadata (creation time, TTL), and encrypted public keys for key exchange. All data is automatically deleted when the room expires. We do not log IP addresses or any identifying information.',
  },
  {
    question: 'Can I use Phantom Chat on mobile?',
    answer:
      'Yes. Phantom Chat is fully responsive and works on any modern browser - desktop, tablet, or mobile. Simply visit the site and create or join a room. No app installation required, which also means no traces left on your device.',
  },
  {
    question: 'What if the other person screenshots my messages?',
    answer:
      'While we protect against server-side data collection, we cannot prevent the recipient from taking screenshots or photos of their screen. Only chat with people you trust. This is true for any communication platform.',
  },
  {
    question: 'Is Phantom Chat legal?',
    answer:
      'Yes. Using encrypted communication is legal in most countries. Phantom Chat is designed for legitimate privacy needs: journalists protecting sources, activists in restrictive regions, businesses discussing confidential matters, or anyone who values their privacy. We do not condone illegal activities.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> FAQ
          </h1>
          <p className="text-lg text-zinc-400">
            Frequently asked questions about Phantom Chat.
            <br />
            Everything you need to know about secure, self-destructing communication.
          </p>
          <nav className="mt-6" aria-label="Quick navigation">
            <ul className="flex flex-wrap justify-center gap-4 font-mono text-sm">
              <li>
                <a
                  href="#tldr"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [TL;DR]
                </a>
              </li>
              <li>
                <a
                  href="#faq-list"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Questions]
                </a>
              </li>
              <li>
                <Link
                  href="/chat/security"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Security]
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* TL;DR Section */}
        <section
          id="tldr"
          className="mb-12 border border-green-500/30 bg-green-500/5 p-6"
          aria-labelledby="tldr-heading"
        >
          <h2
            id="tldr-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">$</span> TL;DR
          </h2>
          <ul className="space-y-2 font-mono text-sm text-zinc-300">
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">No accounts</strong> - Zero registration required
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">E2E Encrypted</strong> - AES-256-GCM encryption
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">Self-destructing</strong> - Auto-delete on TTL expiry
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">Zero-knowledge</strong> - We can&apos;t read your messages
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>
                <strong className="text-green-400">100% Free</strong> - No premium, no ads
              </span>
            </li>
          </ul>
        </section>

        {/* FAQ List */}
        <section
          id="faq-list"
          className="space-y-4"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="sr-only">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-zinc-800 bg-zinc-900/50 transition-all hover:border-green-500/30"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between p-6">
                <h3 className="flex-1 pr-4 font-mono text-base font-semibold text-zinc-100">
                  <span className="mr-2 text-green-600">{`[${String(index + 1).padStart(2, '0')}]`}</span>
                  {faq.question}
                </h3>
                <svg
                  className="h-5 w-5 flex-shrink-0 text-green-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="border-t border-zinc-800 px-6 pt-4 pb-6">
                <p className="leading-relaxed text-zinc-400">{faq.answer}</p>
              </div>
            </details>
          ))}
        </section>

        {/* CTA Section */}
        <section
          className="mt-16 border border-green-500/30 bg-green-500/5 p-8 text-center"
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="mb-3 font-mono text-2xl font-bold text-green-400"
          >
            READY TO GO DARK?
          </h2>
          <p className="mb-6 text-zinc-400">
            Start a secure conversation in seconds. No signup required.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create"
              className="border border-green-500 bg-green-500/10 px-8 py-3 font-mono text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
            >
              [INITIALIZE_ROOM]
            </Link>
            <Link
              href="/chat/encryption"
              className="border border-zinc-700 px-8 py-3 font-mono text-sm font-bold text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
            >
              [LEARN_ENCRYPTION]
            </Link>
          </div>
        </section>

        {/* Quick Links */}
        <section
          className="mt-12 grid gap-4 sm:grid-cols-3"
          aria-labelledby="quick-links-heading"
        >
          <h2 id="quick-links-heading" className="sr-only">
            Related Pages
          </h2>
          <Link
            href="/chat/guide"
            className="border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-green-500/30"
          >
            <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
              [GUIDE]
            </h3>
            <p className="text-sm text-zinc-500">
              Step-by-step guide to using Phantom Chat
            </p>
          </Link>
          <Link
            href="/chat/security"
            className="border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-green-500/30"
          >
            <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
              [SECURITY]
            </h3>
            <p className="text-sm text-zinc-500">
              How we protect your privacy and data
            </p>
          </Link>
          <Link
            href="/chat/encryption"
            className="border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-green-500/30"
          >
            <h3 className="mb-2 font-mono text-sm font-bold text-green-400">
              [ENCRYPTION]
            </h3>
            <p className="text-sm text-zinc-500">
              Deep dive into our E2E encryption
            </p>
          </Link>
        </section>
      </div>
    </div>
  );
}
