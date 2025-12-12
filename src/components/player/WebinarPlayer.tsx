'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { YouTubePlayer, YouTubePlayerHandle } from './YouTubePlayer';
import { ClickBlocker } from './ClickBlocker';
import { LiveBadge } from './LiveBadge';
import { EntryOverlay } from './EntryOverlay';
import { CTABanner } from './CTABanner';
import { EndScreen } from './EndScreen';
import { useWebinarState } from '@/hooks';
import type { Webinar } from '@/types';

interface WebinarPlayerProps {
  webinar: Webinar;
  isEmbed?: boolean;
  isPreview?: boolean;
}

export function WebinarPlayer({ webinar, isEmbed = false, isPreview = false }: WebinarPlayerProps) {
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showInitialOverlay, setShowInitialOverlay] = useState(true);

  const { state, seekPosition, remainingSeconds, loading } = useWebinarState({
    scheduleTime: webinar.scheduleTime,
    durationSec: webinar.durationSec,
  });

  // For preview mode, always show as ON_AIR
  const effectiveState = isPreview ? 'ON_AIR' : state;
  const effectiveSeekPosition = isPreview ? 0 : seekPosition;

  const [isMuted, setIsMuted] = useState(true);

  // Handle entry - start muted for autoplay to work in iframes
  const handleEnter = useCallback(() => {
    if (!playerRef.current) return;

    // Keep muted initially for autoplay to work in cross-origin iframes
    playerRef.current.mute();

    if (effectiveSeekPosition && effectiveSeekPosition > 0) {
      playerRef.current.seekTo(effectiveSeekPosition);
    }

    playerRef.current.play();
    setHasEntered(true);
    setIsMuted(true);

    // Hide initial overlay after YouTube UI fades (about 3 seconds)
    setTimeout(() => {
      setShowInitialOverlay(false);
    }, 3500);
  }, [effectiveSeekPosition]);

  // Handle unmute on user click
  const handleUnmute = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.unMute();
    setIsMuted(false);
  }, []);

  // Track current playback time for CTA
  useEffect(() => {
    if (!hasEntered) return;

    const interval = setInterval(() => {
      const time = playerRef.current?.getCurrentTime() ?? 0;
      setCurrentTime(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEntered]);

  // Show CTA based on timing
  useEffect(() => {
    if (
      webinar.ctaSettings &&
      currentTime >= webinar.ctaSettings.showTimeSec &&
      !showCTA
    ) {
      setShowCTA(true);
    }
  }, [currentTime, webinar.ctaSettings, showCTA]);

  // Handle video end (show end screen before YouTube related videos)
  useEffect(() => {
    if (!hasEntered) return;

    const checkEnd = setInterval(() => {
      const time = playerRef.current?.getCurrentTime() ?? 0;
      const duration = playerRef.current?.getDuration() ?? 0;

      // Show end screen 1 second before video ends
      if (duration > 0 && time >= duration - 1) {
        setShowEndScreen(true);
        playerRef.current?.pause();
        clearInterval(checkEnd);
      }
    }, 500);

    return () => clearInterval(checkEnd);
  }, [hasEntered]);

  // Handle state change to ENDED
  useEffect(() => {
    if (effectiveState === 'ENDED' && !isPreview) {
      setShowEndScreen(true);
    }
  }, [effectiveState, isPreview]);

  const thumbnailUrl =
    webinar.thumbnailUrl ||
    `https://img.youtube.com/vi/${webinar.youtubeId}/hqdefault.jpg`;

  if (loading) {
    return (
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      {/* YouTube Player Container - scaled up to hide UI elements outside viewport */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: '-60px',
            left: '-10px',
            right: '-10px',
            bottom: '-60px',
            width: 'calc(100% + 20px)',
            height: 'calc(100% + 120px)',
          }}
        >
          <YouTubePlayer
            ref={playerRef}
            videoId={webinar.youtubeId}
            className={`w-full h-full ${hasEntered ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* Initial overlay to hide YouTube UI during first few seconds */}
      {hasEntered && showInitialOverlay && !showEndScreen && (
        <div className="absolute inset-0 bg-black z-20 flex items-center justify-center transition-opacity duration-500">
          <div className="text-white text-lg">読み込み中...</div>
        </div>
      )}

      {/* Click Blocker */}
      {hasEntered && !showEndScreen && <ClickBlocker />}

      {/* LIVE Badge */}
      {hasEntered && effectiveState === 'ON_AIR' && !showEndScreen && <LiveBadge />}

      {/* Unmute Button - shown when video is playing but muted */}
      {hasEntered && isMuted && !showEndScreen && !showInitialOverlay && (
        <button
          onClick={handleUnmute}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg transition-all animate-pulse hover:animate-none flex items-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
          </svg>
          タップして音声をオンにする
        </button>
      )}

      {/* Entry Overlay (BEFORE or ON_AIR without entry) */}
      {!hasEntered && !showEndScreen && (
        <EntryOverlay
          thumbnailUrl={thumbnailUrl}
          onEnter={handleEnter}
          remainingSeconds={remainingSeconds}
          isBeforeStart={effectiveState === 'BEFORE'}
        />
      )}

      {/* CTA Banner */}
      {webinar.ctaSettings && !showEndScreen && (
        <CTABanner
          visible={showCTA}
          label={webinar.ctaSettings.label}
          url={webinar.ctaSettings.url}
          isEmbed={isEmbed}
        />
      )}

      {/* End Screen */}
      {showEndScreen && <EndScreen />}
    </div>
  );
}
