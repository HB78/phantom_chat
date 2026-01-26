'use client';

import { STATS } from '@/lib/landing/constants';
import { AnimatedCounter } from './animations/AnimatedCounter';

export function SecurityStats() {
  return (
    <section
      aria-labelledby="stats-title"
      className="relative border-y border-green-500/20 bg-zinc-900/50 px-4 py-24 md:px-8"
    >
      {/* Background Pattern - decorative */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(34, 197, 94, 0.1) 50px,
            rgba(34, 197, 94, 0.1) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(34, 197, 94, 0.1) 50px,
            rgba(34, 197, 94, 0.1) 51px
          )`,
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="stats-title"
            className="mb-4 font-mono text-2xl font-bold text-green-400 md:text-3xl"
          >
            <span className="text-green-500" aria-hidden="true">{'>'}</span> SECURITY_METRICS
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-300">
            Numbers that define our commitment to privacy
          </p>
        </header>

        {/* Stats Grid */}
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <dt className="order-2 font-mono text-xs uppercase tracking-wider text-zinc-400">
                {stat.label}
              </dt>
              <dd className="order-1 mb-2 text-4xl font-bold text-green-400 md:text-5xl">
                <AnimatedCounter
                  end={stat.value}
                  duration={2000}
                  suffix={stat.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
