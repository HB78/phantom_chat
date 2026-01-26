import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'User Guide - Phantom Chat',
  description:
    'Complete guide to using Phantom Chat: creating rooms, sharing links, chatting securely, and destroying rooms. Step-by-step instructions.',
  keywords: [
    'Phantom Chat guide',
    'how to use secure chat',
    'encrypted chat tutorial',
    'self-destructing messages guide',
  ],
  openGraph: {
    title: 'User Guide - Phantom Chat',
    description:
      'Step-by-step guide to secure, self-destructing communication with Phantom Chat.',
  },
};

const steps = [
  {
    number: '01',
    title: 'CREATE A ROOM',
    description:
      'Click the "Initialize Secure Channel" button on the homepage. A unique room is instantly created with its own encryption keys and timer.',
    command: '$ phantom --create-room',
  },
  {
    number: '02',
    title: 'SHARE THE LINK',
    description:
      'Copy the room URL from the header and send it to your contact through any channel (email, SMS, messenger). Only people with the link can join.',
    command: '$ phantom --share <room-id>',
  },
  {
    number: '03',
    title: 'WAIT FOR CONNECTION',
    description:
      'When your contact joins, the encryption handshake begins automatically. You\'ll see "End-to-end encrypted" when the secure channel is established.',
    command: '$ phantom --await-handshake',
  },
  {
    number: '04',
    title: 'CHAT SECURELY',
    description:
      'Exchange messages freely. All content is encrypted before leaving your device. The timer in the header shows remaining room lifetime.',
    command: '$ phantom --send "message"',
  },
  {
    number: '05',
    title: 'DESTROY WHEN DONE',
    description:
      'Click the destroy button to immediately delete the room and all messages. Alternatively, let the timer expire for automatic destruction.',
    command: '$ phantom --destroy <room-id>',
  },
];

const tips = [
  {
    title: 'Share links securely',
    description:
      'The room link is the key to your conversation. Share it through a secure channel or in-person if possible.',
  },
  {
    title: 'Watch the timer',
    description:
      'Keep an eye on the TTL countdown. Once it expires, the room is gone forever with no recovery option.',
  },
  {
    title: 'Don\'t refresh during handshake',
    description:
      'If you refresh while waiting for encryption, you\'ll generate new keys. Wait for both parties to connect.',
  },
  {
    title: 'One room, one conversation',
    description:
      'Create a new room for each sensitive conversation. Don\'t reuse rooms for unrelated discussions.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to use Phantom Chat for secure communication',
  description:
    'Step-by-step guide to creating encrypted, self-destructing chat rooms with Phantom Chat',
  step: steps.map((step) => ({
    '@type': 'HowToStep',
    name: step.title,
    text: step.description,
  })),
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> USER_GUIDE
          </h1>
          <p className="text-lg text-zinc-400">
            Complete guide to secure, self-destructing communication
          </p>
          <nav className="mt-6" aria-label="Guide sections">
            <ul className="flex flex-wrap justify-center gap-4 font-mono text-sm">
              <li>
                <a
                  href="#steps"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Steps]
                </a>
              </li>
              <li>
                <a
                  href="#tips"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [Tips]
                </a>
              </li>
              <li>
                <Link
                  href="/chat/faq"
                  className="text-green-400 underline transition-colors hover:text-green-300"
                >
                  [FAQ]
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Quick Start */}
        <section
          className="mb-12 border border-green-500/30 bg-green-500/5 p-6"
          aria-labelledby="quickstart-heading"
        >
          <h2
            id="quickstart-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">$</span> QUICK_START
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <p className="text-zinc-300">
              <span className="text-green-400">1.</span> Go to{' '}
              <Link href="/create" className="text-green-400 underline">
                /create
              </Link>{' '}
              and click &quot;Create Room&quot;
            </p>
            <p className="text-zinc-300">
              <span className="text-green-400">2.</span> Share the URL with your contact
            </p>
            <p className="text-zinc-300">
              <span className="text-green-400">3.</span> Wait for &quot;End-to-end encrypted&quot; confirmation
            </p>
            <p className="text-zinc-300">
              <span className="text-green-400">4.</span> Chat freely, then destroy when done
            </p>
          </div>
        </section>

        {/* Steps */}
        <section id="steps" aria-labelledby="steps-heading" className="mb-12">
          <h2
            id="steps-heading"
            className="mb-8 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> STEP_BY_STEP
          </h2>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border border-zinc-800 bg-zinc-900/50 transition-all hover:border-green-500/30"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-green-500/30 bg-green-500/10 font-mono text-lg font-bold text-green-400">
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="mb-2 font-mono text-lg font-bold text-zinc-100">
                        {step.title}
                      </h3>
                      <p className="mb-4 text-zinc-400">{step.description}</p>
                      <div className="border-l-2 border-green-500/50 bg-black/30 px-4 py-2 font-mono text-sm text-green-400">
                        {step.command}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section id="tips" aria-labelledby="tips-heading" className="mb-12">
          <h2
            id="tips-heading"
            className="mb-8 font-mono text-2xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> PRO_TIPS
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <h3 className="mb-2 font-mono text-sm font-bold text-amber-400">
                  <span className="text-amber-600">[TIP]</span> {tip.title}
                </h3>
                <p className="text-sm text-zinc-400">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Warning Box */}
        <section
          className="mb-12 border border-red-500/30 bg-red-500/5 p-6"
          aria-labelledby="warning-heading"
        >
          <h2
            id="warning-heading"
            className="mb-3 font-mono text-lg font-bold text-red-400"
          >
            <span className="text-red-600">[!]</span> IMPORTANT_WARNINGS
          </h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start">
              <span className="mr-2 text-red-400">-</span>
              Room links cannot be recovered if lost. Save them securely.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">-</span>
              Destroyed rooms are permanently gone. There is no undo.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">-</span>
              We cannot decrypt your messages. If you lose them, they&apos;re gone.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-400">-</span>
              Max 2 users per room. Third party cannot join an existing room.
            </li>
          </ul>
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
            READY TO START?
          </h2>
          <p className="mb-6 text-zinc-400">
            Create your first secure room in seconds
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create"
              className="border border-green-500 bg-green-500/10 px-8 py-3 font-mono text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
            >
              [CREATE_ROOM]
            </Link>
            <Link
              href="/chat/faq"
              className="border border-zinc-700 px-8 py-3 font-mono text-sm font-bold text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
            >
              [READ_FAQ]
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
