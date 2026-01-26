import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Secure Room',
  description:
    "You've been invited to a private encrypted chat room. End-to-end encryption, self-destructing messages. Click to join the conversation.",
  keywords: [
    'join chat room',
    'secure room',
    'encrypted chat',
    'private conversation',
    'E2E encryption',
    'secret chat',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://phantomchat.app'}/room`,
    title: 'Join Secure Room - Phantom Chat',
    description:
      "You've been invited to a private encrypted chat. End-to-end encryption, self-destructing messages.",
    siteName: 'Phantom Chat',
    images: [
      {
        url: '/phantom.png',
        width: 1200,
        height: 630,
        alt: 'Phantom Chat - Join a secure encrypted chat room',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Secure Room - Phantom Chat',
    description:
      "You've been invited to a private encrypted chat. End-to-end encryption, self-destructing messages.",
    images: ['/phantom.png'],
    creator: '@kenshin',
  },
  // Ne pas indexer les rooms (privées et éphémères)
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
