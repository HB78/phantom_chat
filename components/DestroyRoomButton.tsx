'use client';

import { useDestroyRoom } from '@/hooks/fetch/rooms';
import { RoomIdButtonProps } from '@/types';

const DestroyRoomButton = ({ roomId }: RoomIdButtonProps) => {
  const { mutate: destroy, isPending } = useDestroyRoom();

  return (
    <button
      onClick={() => destroy(roomId)}
      disabled={isPending}
      aria-label="Destroy room and delete all messages"
      aria-busy={isPending}
      className="group flex cursor-pointer items-center justify-center gap-1.5 rounded bg-zinc-800 p-2 text-xs font-bold text-zinc-400 transition-all hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-3 sm:py-1.5"
    >
      <span
        aria-hidden="true"
        className="text-base group-hover:animate-pulse sm:text-sm"
      >
        💣
      </span>
      {/* Text hidden on mobile, visible on sm+ */}
      <span className="hidden sm:inline">
        {isPending ? 'DESTROYING...' : 'DESTROY NOW'}
      </span>
    </button>
  );
};

export default DestroyRoomButton;
