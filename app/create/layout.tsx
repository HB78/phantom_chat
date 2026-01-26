import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Secure Room',
  description:
    'Create a private, self-destructing chat room with end-to-end encryption. No signup required. Start chatting securely in seconds.',
  keywords: [
    'create chat room',
    'secure room',
    'encrypted chat',
    'private conversation',
    'anonymous chat room',
    'E2E encryption',
  ],
  alternates: {
    canonical: '/create',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://phantomchat.app/create',
    title: 'Create Secure Room - Phantom Chat',
    description:
      'Create a private, self-destructing chat room with end-to-end encryption. No signup required.',
    siteName: 'Phantom Chat',
    images: [
      {
        url: '/phantom.png',
        width: 1200,
        height: 630,
        alt: 'Phantom Chat - Create a secure encrypted chat room',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Secure Room - Phantom Chat',
    description:
      'Create a private, self-destructing chat room with end-to-end encryption. No signup required.',
    images: ['/phantom.png'],
    creator: '@kenshin',
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
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
