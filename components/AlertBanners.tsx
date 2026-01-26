'use client';

import { useSearchParams } from 'next/navigation';

function AlertBanners() {
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get('destroyed') === 'true';
  const error = searchParams.get('error');

  return (
    <section aria-label="Notifications">
      {wasDestroyed && (
        <article
          role="alert"
          aria-live="polite"
          className="border border-red-900 bg-red-950/50 p-4 text-center"
        >
          <h2 className="text-sm font-bold text-red-400">ROOM DESTROYED</h2>
          <p className="mt-1 text-xs text-zinc-400">
            All messages were permanently deleted.
          </p>
        </article>
      )}
      {error === 'room-not-found' && (
        <article
          role="alert"
          aria-live="polite"
          className="border border-red-900 bg-red-950/50 p-4 text-center"
        >
          <h2 className="text-sm font-bold text-red-400">ROOM NOT FOUND</h2>
          <p className="mt-1 text-xs text-zinc-400">
            This room expired or never existed
          </p>
        </article>
      )}
      {error === 'room-full' && (
        <article
          role="alert"
          aria-live="polite"
          className="border border-red-900 bg-red-950/50 p-4 text-center"
        >
          <h2 className="text-sm font-bold text-red-400">ROOM FULL</h2>
          <p className="mt-1 text-xs text-zinc-400">
            This room is at maximum capacity
          </p>
        </article>
      )}
    </section>
  );
}
export default AlertBanners;
