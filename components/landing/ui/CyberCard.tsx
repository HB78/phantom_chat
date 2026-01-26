'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface CyberCardProps {
  children: ReactNode;
  className?: string;
}

export function CyberCard({ children, className }: CyberCardProps) {
  return (
    <div
      className={cn(
        'group relative border border-zinc-800 bg-zinc-900/50 p-6',
        'transition-all duration-300',
        'hover:border-green-500/50 hover:bg-zinc-900/80',
        'hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]',
        className
      )}
    >
      {/* Corner accents */}
      <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-green-500/0 transition-colors group-hover:border-green-500/50" />
      <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-green-500/0 transition-colors group-hover:border-green-500/50" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-green-500/0 transition-colors group-hover:border-green-500/50" />
      <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-green-500/0 transition-colors group-hover:border-green-500/50" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 opacity-0 transition-opacity group-hover:opacity-10" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
