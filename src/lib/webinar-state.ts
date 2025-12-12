import dayjs, { nowJST, todayJST } from './dayjs';
import type { WebinarState, WebinarStateResult } from '@/types';

/**
 * Calculate the current state of a webinar based on server time
 */
export function calculateWebinarState(
  serverTime: Date,
  scheduleTime: string, // "HH:mm" format
  durationSec: number
): WebinarStateResult {
  const now = dayjs(serverTime).tz('Asia/Tokyo');
  const today = now.format('YYYY-MM-DD');
  const startTime = dayjs.tz(`${today} ${scheduleTime}`, 'YYYY-MM-DD HH:mm', 'Asia/Tokyo');
  const endTime = startTime.add(durationSec, 'second');

  if (now.isBefore(startTime)) {
    // BEFORE: Show countdown
    const remainingSeconds = startTime.diff(now, 'second');
    return {
      state: 'BEFORE',
      remainingSeconds,
    };
  } else if (now.isBefore(endTime)) {
    // ON_AIR: Calculate seek position
    const seekPosition = now.diff(startTime, 'second');
    return {
      state: 'ON_AIR',
      seekPosition,
    };
  } else {
    // ENDED
    return {
      state: 'ENDED',
    };
  }
}

/**
 * Format remaining seconds to HH:MM:SS or MM:SS
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format duration in seconds to readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}時間${minutes}分${secs}秒`;
  } else if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
}
