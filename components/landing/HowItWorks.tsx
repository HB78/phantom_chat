'use client';

import { STEPS } from '@/lib/landing/constants';

export function HowItWorks() {
  return (
    <section aria-labelledby="howitworks-title" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="howitworks-title"
            className="mb-4 font-mono text-2xl font-bold text-green-400 md:text-3xl"
          >
            <span className="text-green-500" aria-hidden="true">{'>'}</span> HOW_IT_WORKS
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-300">
            Three simple steps to complete anonymity
          </p>
        </header>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - decorative */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-8 hidden h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-green-500/50 to-transparent md:block"
          />

          <ol className="grid gap-8 md:grid-cols-3" role="list">
            {STEPS.map((step, index) => (
              <li key={index} className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="relative mb-6">
                  <div
                    className="flex h-16 w-16 items-center justify-center border-2 border-green-500 bg-zinc-950 font-mono text-2xl font-bold text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  {/* Pulse animation - decorative */}
                  <div aria-hidden="true" className="absolute inset-0 animate-ping border-2 border-green-500/30" />
                </div>

                {/* Icon - decorative */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center" aria-hidden="true">
                  <step.icon className="h-8 w-8 text-green-400" />
                </div>

                {/* Title */}
                <h3 className="mb-2 font-mono text-lg font-bold text-zinc-100">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
