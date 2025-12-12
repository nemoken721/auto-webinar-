'use client';

import { formatCountdown } from '@/lib/webinar-state';

interface EntryOverlayProps {
  thumbnailUrl: string;
  onEnter: () => void;
  remainingSeconds?: number;
  isBeforeStart?: boolean;
}

export function EntryOverlay({
  thumbnailUrl,
  onEnter,
  remainingSeconds,
  isBeforeStart = false,
}: EntryOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${thumbnailUrl})`,
          filter: 'blur(8px) brightness(0.5)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        {isBeforeStart && remainingSeconds !== undefined && (
          <div className="mb-8">
            <p className="text-lg mb-2 text-white/80">開催まで あと</p>
            <p className="text-5xl font-bold tabular-nums tracking-tight">
              {formatCountdown(remainingSeconds)}
            </p>
          </div>
        )}

        {!isBeforeStart && (
          <>
            <p className="text-lg mb-6 text-white/90">配信中です</p>
            <button
              onClick={onEnter}
              className="px-10 py-5 bg-red-600 hover:bg-red-700 rounded-xl text-xl font-bold
                         shadow-lg shadow-red-600/30 transition-all duration-300
                         animate-pulse hover:animate-none hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-red-500/50"
            >
              会場に入場する
            </button>
          </>
        )}

        {isBeforeStart && (
          <p className="mt-6 text-white/60 text-sm">
            開始時刻になりましたら、入場ボタンが表示されます
          </p>
        )}
      </div>
    </div>
  );
}
