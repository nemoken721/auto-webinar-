'use client';

interface ClickBlockerProps {
  className?: string;
}

export function ClickBlocker({ className }: ClickBlockerProps) {
  return (
    <div
      className={`absolute inset-0 z-10 ${className || ''}`}
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
