'use client';

interface LiveBadgeProps {
  className?: string;
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div
      className={`absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-0.5 sm:py-1.5
                  bg-black/60 backdrop-blur-sm rounded sm:rounded-md ${className || ''}`}
    >
      <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
      </span>
      <span className="text-white text-[10px] sm:text-sm font-bold tracking-wider">LIVE</span>
    </div>
  );
}
