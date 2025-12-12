'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerOptions {
  videoId: string;
  onReady?: () => void;
  onStateChange?: (state: YT.PlayerState) => void;
  onEnd?: () => void;
}

export function useYouTubePlayer({
  videoId,
  onReady,
  onStateChange,
  onEnd,
}: UseYouTubePlayerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setIsAPILoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existingScript) {
      // Wait for API to load
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setIsAPILoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Load script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsAPILoaded(true);
    };
  }, []);

  // Initialize player when API is loaded
  useEffect(() => {
    if (!isAPILoaded || !containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        showinfo: 0,
        autohide: 1,
        cc_load_policy: 0,
        enablejsapi: 1,
        autoplay: 0,
        mute: 0,
      },
      events: {
        onReady: () => {
          setIsReady(true);
          onReady?.();
        },
        onStateChange: (event) => {
          onStateChange?.(event.data);
          if (event.data === window.YT.PlayerState.ENDED) {
            onEnd?.();
          }
        },
      },
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isAPILoaded, videoId, onReady, onStateChange, onEnd]);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const mute = useCallback(() => {
    playerRef.current?.mute();
  }, []);

  const unMute = useCallback(() => {
    playerRef.current?.unMute();
  }, []);

  const setVolume = useCallback((volume: number) => {
    playerRef.current?.setVolume(volume);
  }, []);

  const getCurrentTime = useCallback((): number => {
    return playerRef.current?.getCurrentTime() ?? 0;
  }, []);

  const getDuration = useCallback((): number => {
    return playerRef.current?.getDuration() ?? 0;
  }, []);

  return {
    containerRef,
    isReady,
    play,
    pause,
    seekTo,
    mute,
    unMute,
    setVolume,
    getCurrentTime,
    getDuration,
  };
}
