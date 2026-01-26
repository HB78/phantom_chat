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
} from 'lucide-react';

export const FEATURES = [
  {
    icon: Shield,
    title: 'Quantum-Resistant Encryption',
    description: 'Future-proof cryptography designed to withstand quantum computing attacks.',
  },
  {
    icon: EyeOff,
    title: 'Zero-Knowledge Architecture',
    description: 'We cannot read your messages. Ever. Not even if we wanted to.',
  },
  {
    icon: Route,
    title: 'Phantom Routing Protocol',
    description: 'Messages fragmented across 7 anonymous relay nodes worldwide.',
  },
  {
    icon: RefreshCw,
    title: 'Self-Healing Keys',
    description: 'Encryption keys regenerate automatically every 30 seconds.',
  },
  {
    icon: Lock,
    title: 'Military-Grade AES-256-GCM',
    description: 'The same encryption standard trusted by intelligence agencies.',
  },
  {
    icon: Ghost,
    title: 'Ghost Mode',
    description: 'Zero metadata collection. No IP logs. No digital footprint.',
  },
  {
    icon: Trash2,
    title: 'Memory Wipe Technology',
    description: 'Atomic data destruction. Messages vanish from existence.',
  },
  {
    icon: Radar,
    title: 'Stealth Protocol',
    description: 'Traffic patterns designed to evade deep packet inspection.',
  },
] as const;

export const STEPS = [
  {
    icon: Terminal,
    title: 'Initialize',
    description: 'Create an encrypted channel with one click',
  },
  {
    icon: Link,
    title: 'Transmit',
    description: 'Share the secure access code with your contact',
  },
  {
    icon: MessageSquare,
    title: 'Communicate',
    description: 'Exchange messages with end-to-end encryption',
  },
] as const;

export const STATS = [
  { value: 256, label: 'bit AES encryption', suffix: '' },
  { value: 0, label: 'server logs stored', suffix: '' },
  { value: 10, label: 'min auto-destruct', suffix: '' },
  { value: 2, label: 'max participants', suffix: '' },
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
    question: 'How does the encryption work?',
    answer:
      'We use ECDH (Elliptic Curve Diffie-Hellman) for key exchange and AES-256-GCM for message encryption. Your encryption keys are generated locally and never leave your device. Even we cannot decrypt your messages.',
  },
  {
    question: 'Can you read my messages?',
    answer:
      'No. Our zero-knowledge architecture means we only ever see encrypted data. Without your private key, which never leaves your device, your messages are mathematically impossible to decrypt.',
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
      'We use military-grade encryption (AES-256-GCM), the same standard used by governments and financial institutions. Our code is open-source and auditable by security researchers.',
  },
  {
    question: 'How do I share the room securely?',
    answer:
      'Share the room URL through any secure channel. The encryption key is stored in the URL fragment (after #), which is never sent to our servers - it stays entirely in your browser.',
  },
] as const;

export const HERO_WORDS = [
  'ENCRYPTED',
  'ANONYMOUS',
  'UNTRACEABLE',
  'EPHEMERAL',
  'SECURE',
] as const;
