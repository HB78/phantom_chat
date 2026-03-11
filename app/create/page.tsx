'use client';

import AlertBanners from '@/components/AlertBanners';
import { useCreateRoom } from '@/hooks/fetch/rooms';
import { useUsername } from '@/hooks/use-username';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  const { mutate: createRoom, isPending } = useCreateRoom();
  const { username } = useUsername();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080B0F] p-4">
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm space-y-6">
        {/* Alert banners */}
        <Suspense fallback={null}>
          <AlertBanners />
        </Suspense>

        {/* Header */}
        <section aria-labelledby="app-title" className="space-y-3 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-900/60 bg-green-950/40 px-3 py-1">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"
            />
            <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-green-400 uppercase">
              Encrypted · End-to-End
            </span>
          </div>

          <h1
            id="app-title"
            className="font-mono text-3xl font-bold tracking-tight text-white"
          >
            <span aria-hidden="true" className="text-green-400">
              &gt;{' '}
            </span>
            private
            <span className="text-green-400">_</span>chat
          </h1>

          <p className="text-sm leading-relaxed text-zinc-500">
            Self-destructing rooms. Zero logs. No identity required.
          </p>
        </section>

        {/* Card */}
        <section
          aria-label="Create a chat room"
          className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-md"
        >
          {/* Top accent line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
          />

          <div className="space-y-5">
            {/* Identity field */}
            <div className="space-y-2">
              <label
                id="identity-label"
                className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-zinc-500 uppercase"
              >
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Your anonymous identity
              </label>

              <output
                aria-labelledby="identity-label"
                aria-label={`Your anonymous username is ${username}`}
                className="flex w-full items-center gap-3 rounded-lg border border-zinc-700/60 bg-zinc-950/80 px-4 py-3 font-mono text-sm text-zinc-200 ring-1 ring-zinc-800/50 ring-inset"
              >
                <span aria-hidden="true" className="text-green-500 opacity-70">
                  $
                </span>
                <span className="flex-1 truncate">{username}</span>
                <span
                  aria-hidden="true"
                  className="h-3.5 w-px animate-pulse bg-green-400"
                />
              </output>

              <p className="text-[11px] text-zinc-600">
                Randomly assigned · changes each session
              </p>
            </div>

            {/* Divider */}
            <div aria-hidden="true" className="border-t border-zinc-800/80" />

            {/* Create button */}
            <button
              onClick={() => createRoom()}
              disabled={isPending}
              aria-busy={isPending}
              aria-label={
                isPending
                  ? 'Creating your secure room…'
                  : 'Create a new secure chat room'
              }
              className="group relative w-full cursor-pointer overflow-hidden rounded-lg bg-green-500 px-4 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-green-400 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              {/* Shimmer on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"
              />

              <span className="relative flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating room…
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create secure room
                  </>
                )}
              </span>
            </button>

            {/* Back link */}
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700/60 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-150 hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:outline-none"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </Link>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center font-mono text-[10px] text-zinc-700">
          rooms auto-destruct on exit · no data retained
        </p>
      </div>
    </main>
  );
}
