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
    'Secure, self-destructing chat rooms with end-to-end encryption. No accounts, no logs, no traces. Military-grade privacy for your conversations.',
  keywords: [
    'encrypted chat',
    'secure messaging',
    'self-destructing messages',
    'anonymous chat',
    'E2E encryption',
    'private chat',
    'Dark Net',
    'quantum',
    'quantum encryption',
  ],
  authors: [{ name: 'Phantom Chat' }],
  creator: 'Phantom',
  publisher: 'Phantom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://phantomchat.app'),
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
    url: 'https://phantomchat.app',
    title: 'Phantom Chat - Le Chat crypté et chiffré ultime',
    description:
      'Secure, self-destructing chat rooms with end-to-end encryption. No accounts, no logs, no traces. Military-grade privacy for your conversations.',
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
      'Secure, self-destructing chat rooms with end-to-end encryption. No accounts, no logs, no traces. Military-grade privacy for your conversations.',
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
