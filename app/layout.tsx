import { Providers } from '@/providers/providers';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jet-brains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default:'Phantom Chat - Self-Destructing Encrypted Chat',
    template: '%s | Phantom Chat',
    },

  description:
    'Post-quantum encrypted chat rooms that self-destruct in 10 minutes. ML-KEM (Kyber) + ECDH hybrid encryption - same security level as Signal & iMessage. No accounts, no logs, no traces. Quantum-safe privacy.',
  keywords: [
    // Post-quantum
    'post-quantum encryption',
    'quantum-safe chat',
    'quantum-resistant encryption',
    'ML-KEM',
    'Kyber encryption',
    'post-quantum cryptography',
    // Encryption
    'encrypted chat',
    'end-to-end encryption',
    'E2E encryption',
    'AES-256-GCM',
    'ECDH',
    'military-grade encryption',
    // Privacy
    'secure messaging',
    'private chat',
    'anonymous chat',
    'zero-knowledge',
    'no account chat',
    'no phone number',
    // Features
    'self-destructing messages',
    'ephemeral chat',
    'auto-delete messages',
    'disappearing messages',
    'temporary chat',
    // Comparisons
    'Signal alternative',
    'secure chat app',
    // French
    'chat chiffre',
    'messagerie securisee',
    'chiffrement post-quantique',
    'chat anonyme',
  ],
  authors: [{ name: 'Phantom Chat' }],
  creator: 'Phantom',
  publisher: 'Phantom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_APP_URL
      : 'https://phantomchat.app'
  ),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://phantomchat.app',
    title: 'Phantom Chat - Le Chat crypté et chiffré ultime',
    description:
      'Secure, self-destructing chat rooms with end-to-end encryption. No accounts, no logs, no traces. Military-grade privacy for your conversations. Post-quantum encryption (ML-KEM + ECDH) - same security as Signal & iMessage.',
    siteName: 'Phantom Chat',
    images: [
      {
        url: '/phantom.png',
        width: 1200,
        height: 630,
        alt: 'Phantom Chat - Le chat crypté du dark web ultime à votre disposition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phantom Chat - Le chat crypté du dark web ultime à votre disposition',
    description:
      'Secure, self-destructing chat rooms with end-to-end encryption. No accounts, no logs, no traces. Military-grade privacy for your conversations. Post-quantum encryption (ML-KEM + ECDH) - quantum-safe security.',
    images: ['/phantom.png'],
    creator: '@kenshin', // Remplace par ton handle Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/phantom.png',
    apple: '/phantom.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for keyboard users */}
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-green-500 focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:text-zinc-950 focus:outline-none"
        >
          Skip to main content
        </Link>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
