'use client';

import TextType from '@/components/ui/TextType';
import { HERO_WORDS } from '@/lib/landing/constants';
import { GlitchText } from './animations/GlitchText';
import { MatrixRain } from './animations/MatrixRain';
import { CyberButton } from './ui/CyberButton';
import { TerminalWindow } from './ui/TerminalWindow';

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      {/* Matrix Rain Background - decorative */}
      <div aria-hidden="true">
        <MatrixRain opacity={0.3} />
      </div>

      {/* Scanline Overlay - decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.02]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-2xl">
        <TerminalWindow title="phantom_chat.exe" className="mx-auto">
          <div className="space-y-6 text-center">
            {/* Main Title */}
            <div className="space-y-2">
              <GlitchText intensity="low">
                <h1
                  id="hero-title"
                  className="font-mono text-4xl font-bold text-green-400 md:text-5xl lg:text-6xl"
                >
                  PHANTOM<span className="text-zinc-400" aria-hidden="true">_</span>CHAT
                </h1>
              </GlitchText>

              {/* Typing Effect Subtitle */}
              <p
                className="h-8 font-mono text-xl text-green-400/90 md:text-2xl"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-green-500" aria-hidden="true">{'>'}</span>{' '}
                <TextType
                  text={[...HERO_WORDS]}
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={2000}
                  showCursor
                  cursorCharacter="_"
                  loop
                  className="text-green-400"
                />
              </p>
            </div>

            {/* Description */}
            <p className="mx-auto max-w-md text-sm text-zinc-300 md:text-base">
              Post-quantum encrypted chat rooms that self-destruct.
              <br />
              No accounts. No logs. No traces.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <CyberButton href="/create" variant="primary">
                INITIALIZE SECURE CHANNEL
              </CyberButton>
            </div>

            {/* Terminal Status - decorative */}
            <div
              aria-hidden="true"
              className="pt-6 font-mono text-xs text-zinc-400"
            >
              <p>
                <span className="text-green-500">$</span> status:{' '}
                <span className="animate-pulse text-green-400">ONLINE</span>
              </p>
              <p>
                <span className="text-green-500">$</span> encryption:{' '}
                <span className="text-green-400">ML-KEM-768 + AES-256-GCM</span>
              </p>
              <p>
                <span className="text-green-500">$</span> quantum_safe:{' '}
                <span className="text-green-400">TRUE</span>
              </p>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
