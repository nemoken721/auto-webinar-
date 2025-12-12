'use client';

import { useYouTubePlayer } from '@/hooks';
import { forwardRef, useImperativeHandle } from 'react';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onStateChange?: (state: YT.PlayerState) => void;
  onEnd?: () => void;
  className?: string;
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  function YouTubePlayer({ videoId, onReady, onStateChange, onEnd, className }, ref) {
    const {
      containerRef,
      isReady,
      play,
      pause,
      seekTo,
      mute,
      unMute,
      getCurrentTime,
      getDuration,
    } = useYouTubePlayer({ videoId, onReady, onStateChange, onEnd });

    useImperativeHandle(ref, () => ({
      play,
      pause,
      seekTo,
      mute,
      unMute,
      getCurrentTime,
      getDuration,
    }));

    return (
      <div className={className}>
        <div ref={containerRef} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
      </div>
    );
  }
);
