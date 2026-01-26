'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({
  children,
  className,
  intensity = 'medium',
}: GlitchTextProps) {
  const intensityStyles = {
    low: 'hover:animate-[glitch_0.5s_ease-in-out]',
    medium: 'animate-[glitch_3s_ease-in-out_infinite]',
    high: 'animate-[glitch_0.3s_ease-in-out_infinite]',
  };

  return (
    <span
      className={cn(
        'relative inline-block',
        intensityStyles[intensity],
        className
      )}
      data-text={typeof children === 'string' ? children : undefined}
      style={{
        textShadow: '2px 0 #ff0000, -2px 0 #00ffff',
      }}
    >
      {children}
    </span>
  );
}
