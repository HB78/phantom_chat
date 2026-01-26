'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface TerminalWindowProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function TerminalWindow({
  children,
  className,
  title = 'phantom_chat.exe',
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'relative border border-green-500/30 bg-zinc-950/90 backdrop-blur-md',
        'shadow-[0_0_50px_rgba(34,197,94,0.1)]',
        className
      )}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-green-500/20 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 font-mono text-xs text-green-500/60">{title}</span>
      </div>

      {/* Terminal Content */}
      <div className="p-6">{children}</div>

      {/* Scanline Effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
        }}
      />
    </div>
  );
}
