import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to JST
dayjs.tz.setDefault('Asia/Tokyo');

export default dayjs;

// Helper to get current JST time
export function nowJST() {
  return dayjs().tz('Asia/Tokyo');
}

// Helper to parse time in JST
export function parseJST(date: string | Date) {
  return dayjs(date).tz('Asia/Tokyo');
}

// Helper to get today's date string in JST
export function todayJST() {
  return nowJST().format('YYYY-MM-DD');
}
