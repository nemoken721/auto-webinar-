'use client';

interface LiveBadgeProps {
  className?: string;
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div
      className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5
                  bg-black/60 backdrop-blur-sm rounded-md ${className || ''}`}
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      <span className="text-white text-sm font-bold tracking-wider">LIVE</span>
    </div>
  );
}
