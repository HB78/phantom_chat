import {
  Shield,
  EyeOff,
  Route,
  RefreshCw,
  Lock,
  Ghost,
  Trash2,
  Radar,
  Terminal,
  Link,
  MessageSquare,
  Atom,
} from 'lucide-react';

export const FEATURES = [
  {
    icon: Atom,
    title: 'Post-Quantum Encryption',
    description:
      'ML-KEM (Kyber) + ECDH hybrid encryption. Protected against future quantum computer attacks.',
  },
  {
    icon: Shield,
    title: 'Quantum-Safe Key Exchange',
    description:
      'Same encryption technology as Signal and iMessage. Future-proof cryptography.',
  },
  {
    icon: EyeOff,
    title: 'Zero-Knowledge Architecture',
    description:
      'We cannot read your messages. Ever. Not even if we wanted to.',
  },
  {
    icon: Lock,
    title: 'Military-Grade AES-256-GCM',
    description:
      'The same encryption standard trusted by intelligence agencies worldwide.',
  },
  {
    icon: Ghost,
    title: 'Ghost Mode',
    description: 'Zero metadata collection. No IP logs. No digital footprint.',
  },
  {
    icon: Trash2,
    title: 'Auto-Destruct Technology',
    description:
      'Messages vanish after 10 minutes. Complete data destruction.',
  },
  {
    icon: RefreshCw,
    title: 'Perfect Forward Secrecy',
    description:
      'New encryption keys for each session. Past messages stay secure forever.',
  },
  {
    icon: Radar,
    title: 'No Account Required',
    description:
      'No email, no phone, no signup. True anonymity from the start.',
  },
] as const;

export const STEPS = [
  {
    icon: Terminal,
    title: 'Initialize',
    description: 'Create a quantum-safe encrypted channel with one click',
  },
  {
    icon: Link,
    title: 'Transmit',
    description: 'Share the secure access code with your contact',
  },
  {
    icon: MessageSquare,
    title: 'Communicate',
    description: 'Exchange messages with post-quantum end-to-end encryption',
  },
] as const;

export const STATS = [
  { value: 256, label: 'bit AES encryption', suffix: '' },
  { value: 768, label: 'bit ML-KEM (Kyber)', suffix: '' },
  { value: 10, label: 'min auto-destruct', suffix: '' },
  { value: 0, label: 'data stored', suffix: '' },
] as const;

export const COMPARISON = {
  headers: ['Feature', 'PhantomChat', 'WhatsApp', 'Telegram', 'Signal'],
  rows: [
    {
      feature: 'End-to-End Encryption',
      phantom: true,
      whatsapp: true,
      telegram: 'partial',
      signal: true,
    },
    {
      feature: 'Post-Quantum Encryption',
      phantom: true,
      whatsapp: false,
      telegram: false,
      signal: true,
    },
    {
      feature: 'Zero Server Logs',
      phantom: true,
      whatsapp: false,
      telegram: false,
      signal: true,
    },
    {
      feature: 'Auto-Destruct Messages',
      phantom: true,
      whatsapp: false,
      telegram: 'partial',
      signal: 'partial',
    },
    {
      feature: 'No Account Required',
      phantom: true,
      whatsapp: false,
      telegram: false,
      signal: false,
    },
    {
      feature: 'No Phone Number',
      phantom: true,
      whatsapp: false,
      telegram: false,
      signal: false,
    },
    {
      feature: 'No Metadata Collection',
      phantom: true,
      whatsapp: false,
      telegram: false,
      signal: 'partial',
    },
    {
      feature: 'Open Source',
      phantom: true,
      whatsapp: false,
      telegram: 'partial',
      signal: true,
    },
  ],
} as const;

export const FAQ = [
  {
    question: 'What is post-quantum encryption?',
    answer:
      'Post-quantum encryption uses algorithms that cannot be broken by quantum computers. We use ML-KEM (formerly Kyber), the NIST-standardized algorithm, combined with ECDH for a hybrid approach. This is the same technology used by Signal and Apple iMessage.',
  },
  {
    question: 'How does the encryption work?',
    answer:
      'We use a hybrid system: ECDH (Elliptic Curve Diffie-Hellman) + ML-KEM-768 (post-quantum) for key exchange, combined with AES-256-GCM for message encryption. Both secrets are combined using HKDF. Your encryption keys are generated locally and never leave your device.',
  },
  {
    question: 'Can you read my messages?',
    answer:
      'No. Our zero-knowledge architecture means we only ever see encrypted data. Without your private keys, which never leave your device, your messages are mathematically impossible to decrypt - even with a quantum computer.',
  },
  {
    question: 'What happens after 10 minutes?',
    answer:
      'Complete data destruction. All messages, encryption keys, and room metadata are permanently deleted from our servers. There is no backup, no archive, no recovery possible.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No accounts, no emails, no phone numbers. Just create a room and share the link. Your identity remains completely anonymous.',
  },
  {
    question: 'Is it really secure?',
    answer:
      'We use post-quantum encryption (ML-KEM-768) combined with military-grade AES-256-GCM. This puts PhantomChat at the same security level as Signal and Apple iMessage - protected against both current and future quantum computer attacks.',
  },
  {
    question: 'How do I share the room securely?',
    answer:
      'Share the room URL through any secure channel you trust (Signal, in person, etc.). The room ID identifies your chat, but all messages are end-to-end encrypted with post-quantum protection.',
  },
] as const;

export const HERO_WORDS = [
  'QUANTUM-SAFE',
  'ENCRYPTED',
  'ANONYMOUS',
  'UNTRACEABLE',
  'EPHEMERAL',
  'POST-QUANTUM',
] as const;
