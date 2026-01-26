'use client';

import { FEATURES } from '@/lib/landing/constants';
import { CyberCard } from './ui/CyberCard';

export function FeaturesGrid() {
  return (
    <section aria-labelledby="features-title" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="features-title"
            className="mb-4 font-mono text-2xl font-bold text-green-400 md:text-3xl"
          >
            <span className="text-green-500" aria-hidden="true">{'>'}</span> SECURITY_FEATURES
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-300">
            Military-grade protection powered by cutting-edge cryptography
          </p>
        </header>

        {/* Features Grid */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {FEATURES.map((feature, index) => (
            <li key={index}>
              <CyberCard>
                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center border border-green-500/30 bg-green-500/10"
                    aria-hidden="true"
                  >
                    <feature.icon className="h-6 w-6 text-green-400" />
                  </div>

                  {/* Title */}
                  <h3 className="font-mono text-sm font-bold text-green-400">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {feature.description}
                  </p>
                </div>
              </CyberCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
