'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ServerTimeResponse } from '@/types';

export function useServerTime(intervalMs: number = 1000) {
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServerTime = useCallback(async () => {
    try {
      const requestTime = Date.now();
      const response = await fetch('/api/server-time');
      const responseTime = Date.now();
      const data: ServerTimeResponse = await response.json();

      // Calculate network latency and adjust
      const latency = (responseTime - requestTime) / 2;
      const serverTimestamp = data.timestamp + latency;

      // Calculate offset between server and client
      const newOffset = serverTimestamp - Date.now();
      setOffset(newOffset);
      setServerTime(new Date(serverTimestamp));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch server time'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchServerTime();
  }, [fetchServerTime]);

  // Update local time with offset
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setServerTime(new Date(Date.now() + offset));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [offset, intervalMs, loading]);

  // Periodic sync with server (every 30 seconds)
  useEffect(() => {
    const syncTimer = setInterval(fetchServerTime, 30000);
    return () => clearInterval(syncTimer);
  }, [fetchServerTime]);

  return { serverTime, loading, error, refetch: fetchServerTime };
}
