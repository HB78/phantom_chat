'use client';

import { formatTimeRemaining } from '@/lib/tools/tool';
import { RoomIdButtonProps } from '@/types';
import { useState } from 'react';
import DestroyRoomButton from './DestroyRoomButton';

interface HeaderProps extends RoomIdButtonProps {
  timeRemaining: number | null;
}

const Header = ({ roomId, timeRemaining }: HeaderProps) => {
  const [copyStatus, setCopyStatus] = useState('COPY');

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus('COPIED!');
    setTimeout(() => setCopyStatus('COPY'), 2000);
  };

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-3 py-3 sm:px-4 sm:py-4">
      <nav
        aria-label="Room information"
        className="flex w-full items-center justify-between gap-2 sm:gap-4"
      >
        {/* Room ID */}
        <div className="flex flex-col">
          <span
            id="room-id-label"
            className="text-[10px] text-zinc-400 uppercase sm:text-xs"
          >
            Room
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              aria-labelledby="room-id-label"
              className="max-w-[80px] truncate text-sm font-bold text-green-400 sm:max-w-none sm:text-base"
              title={roomId}
            >
              {roomId}
            </span>
            <button
              onClick={copyLink}
              aria-label={
                copyStatus === 'COPIED!' ? 'Link copied' : 'Copy room link'
              }
              className="cursor-pointer rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none sm:px-2"
            >
              {copyStatus}
            </button>
          </div>
        </div>

        {/* separator - hidden on mobile */}
        <div
          aria-hidden="true"
          className="hidden h-8 w-px bg-zinc-800 md:block"
        />

        {/* Countdown */}
        <div className="flex flex-col">
          <span
            id="countdown-label"
            className="hidden text-xs text-zinc-400 uppercase sm:block"
          >
            Self Destruction
          </span>
          {/* Mobile: show icon instead of label */}
          <span
            aria-hidden="true"
            className="text-[10px] text-zinc-400 uppercase sm:hidden"
          >
            ⏱️ TTL
          </span>
          <time
            aria-labelledby="countdown-label"
            aria-live="polite"
            className={`text-sm font-bold sm:text-base ${
              timeRemaining !== null && timeRemaining < 60
                ? 'animate-pulse text-red-400'
                : 'text-amber-400'
            }`}
          >
            {timeRemaining !== null
              ? formatTimeRemaining(timeRemaining)
              : '--:--'}
          </time>
        </div>
        <DestroyRoomButton roomId={roomId} />
      </nav>
    </header>
  );
};

export default Header;
