'use client';

import { useSearchParams } from 'next/navigation';

// Maps each alert type to its content and visual config
const ALERTS = {
  destroyed: {
    title: 'Room destroyed',
    description: 'All messages were permanently deleted.',
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
    classes: {
      wrapper: 'border-red-800/60 bg-red-950/50',
      icon: 'text-red-400',
      title: 'text-red-300',
      desc: 'text-red-400/70',
      glow: 'from-red-500/20',
    },
  },
  'room-not-found': {
    title: 'Room not found',
    description: 'This room expired or never existed.',
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    classes: {
      wrapper: 'border-amber-800/60 bg-amber-950/50',
      icon: 'text-amber-400',
      title: 'text-amber-300',
      desc: 'text-amber-400/70',
      glow: 'from-amber-500/20',
    },
  },
  'room-full': {
    title: 'Room is full',
    description: 'This room has reached maximum capacity.',
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    classes: {
      wrapper: 'border-orange-800/60 bg-orange-950/50',
      icon: 'text-orange-400',
      title: 'text-orange-300',
      desc: 'text-orange-400/70',
      glow: 'from-orange-500/20',
    },
  },
} as const;

type AlertKey = keyof typeof ALERTS;

function Alert({ type }: { type: AlertKey }) {
  const { title, description, icon, classes } = ALERTS[type];

  return (
    <article
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`relative overflow-hidden rounded-lg border px-4 py-3.5 ${classes.wrapper}`}
    >
      {/* Left glow accent */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b ${classes.glow} to-transparent`}
      />

      <div className="flex items-start gap-3">
        <span className={`mt-0.5 ${classes.icon}`}>{icon}</span>
        <div className="min-w-0 space-y-0.5">
          <p className={`text-sm font-semibold ${classes.title}`}>{title}</p>
          <p className={`text-xs leading-relaxed ${classes.desc}`}>
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

function AlertBanners() {
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get('destroyed') === 'true';
  const error = searchParams.get('error') as AlertKey | null;

  const activeAlerts: AlertKey[] = [
    ...(wasDestroyed ? (['destroyed'] as AlertKey[]) : []),
    ...(error && error in ALERTS ? ([error] as AlertKey[]) : []),
  ];

  if (activeAlerts.length === 0) return null;

  return (
    <section aria-label="Notifications" className="space-y-2">
      {activeAlerts.map((type) => (
        <Alert key={type} type={type} />
      ))}
    </section>
  );
}

export default AlertBanners;
