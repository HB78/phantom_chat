
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
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <Suspense fallback={null}>
          <AlertBanners />
        </Suspense>

        <section aria-labelledby="app-title" className="space-y-2 text-center">
          <h1
            id="app-title"
            className="text-2xl font-bold tracking-tight text-green-400"
          >
            <span aria-hidden="true">{'>'}</span>
            private Chat
          </h1>
          <p className="text-sm text-zinc-400">
            A private, self-destructing chat room.
          </p>
        </section>

        <section
          aria-label="Create a room"
          className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md"
        >
          <div className="space-y-5">
            <div className="space-y-2 text-center">
              <label id="identity-label" className="flex items-center text-zinc-400">
                Your Identity
              </label>
              <div className="flex items-center gap-3">
                <output
                  aria-labelledby="identity-label"
                  className="flex-1 border border-zinc-800 bg-zinc-950 p-3 font-mono text-sm text-zinc-300"
                >
                  {username}
                </output>
              </div>
            </div>
            <button
              onClick={() => createRoom()}
              disabled={isPending}
              aria-busy={isPending}
              aria-label="Create a new secure chat room"
              className="mt-2 w-full cursor-pointer bg-zinc-100 p-3 text-sm font-bold text-black transition-colors hover:bg-zinc-50 hover:font-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'CREATING...' : 'CREATE SECURE ROOM'}
            </button>
            <Link
              href="/"
              className="mt-2 block w-full border border-zinc-700 p-3 text-center text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              BACK TO HOME
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
