'use client';

import { useMemo } from 'react';
import { useServerTime } from './useServerTime';
import { calculateWebinarState } from '@/lib/webinar-state';
import type { WebinarStateResult } from '@/types';

interface UseWebinarStateOptions {
  scheduleTime: string; // "HH:mm"
  durationSec: number;
}

export function useWebinarState({ scheduleTime, durationSec }: UseWebinarStateOptions) {
  const { serverTime, loading, error } = useServerTime(1000);

  const stateResult: WebinarStateResult | null = useMemo(() => {
    if (!serverTime) return null;
    return calculateWebinarState(serverTime, scheduleTime, durationSec);
  }, [serverTime, scheduleTime, durationSec]);

  return {
    state: stateResult?.state ?? null,
    seekPosition: stateResult?.seekPosition,
    remainingSeconds: stateResult?.remainingSeconds,
    loading,
    error,
    serverTime,
  };
}
