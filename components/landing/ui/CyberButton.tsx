'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { type ReactNode } from 'react';

interface CyberButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}

export function CyberButton({
  children,
  href,
  onClick,
  className,
  variant = 'primary',
  'aria-label': ariaLabel,
}: CyberButtonProps) {
  const baseStyles = cn(
    'relative group inline-flex items-center justify-center',
    'px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider',
    'transition-all duration-300',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
    'before:absolute before:inset-0 before:border before:transition-all before:duration-300',
    'after:absolute after:inset-0 after:border after:transition-all after:duration-300',
    variant === 'primary' && [
      'bg-green-500/10 text-green-400',
      'before:border-green-500/50 before:translate-x-1 before:translate-y-1',
      'after:border-green-400',
      'hover:bg-green-500/20 hover:text-green-300',
      'hover:before:translate-x-0 hover:before:translate-y-0',
      'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]',
      'focus-visible:ring-green-500',
    ],
    variant === 'secondary' && [
      'bg-zinc-800/50 text-zinc-300',
      'before:border-zinc-700 before:translate-x-1 before:translate-y-1',
      'after:border-zinc-600',
      'hover:bg-zinc-800 hover:text-zinc-100',
      'hover:before:translate-x-0 hover:before:translate-y-0',
      'focus-visible:ring-zinc-500',
    ],
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles} aria-label={ariaLabel}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseStyles} aria-label={ariaLabel}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
