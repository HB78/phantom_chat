'use client';

import { CyberButton } from './ui/CyberButton';
import { MatrixRain } from './animations/MatrixRain';

export function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden px-4 py-24 md:px-8">
      {/* Background Matrix Rain - decorative */}
      <div aria-hidden="true">
        <MatrixRain opacity={0.15} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2
          id="cta-title"
          className="mb-4 font-mono text-3xl font-bold text-green-400 md:text-4xl"
        >
          READY TO GO DARK?
        </h2>

        <p className="mb-8 text-zinc-300">
          Your private conversation is one click away.
          <br />
          Post-quantum encryption. No signup. No traces.
        </p>

        <CyberButton href="/create">LAUNCH SECURE CHAT</CyberButton>

        {/* Terminal-style footer - decorative */}
        <div aria-hidden="true" className="mt-12 font-mono text-xs text-zinc-400">
          <p>
            <span className="text-green-500">{'>'}</span> connection_status:{' '}
            <span className="text-green-400">SECURE</span>
          </p>
          <p>
            <span className="text-green-500">{'>'}</span> quantum_safe:{' '}
            <span className="text-green-400">TRUE</span>
          </p>
          <p>
            <span className="text-green-500">{'>'}</span> trace_possibility:{' '}
            <span className="text-green-400">NULL</span>
          </p>
        </div>
      </div>
    </section>
  );
}
