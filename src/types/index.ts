import { Timestamp } from 'firebase/firestore';

// Firestore Types
export interface Tenant {
  uid: string;
  email: string;
  companyName: string;
  status: 'active' | 'suspended';
  isAdmin?: boolean;
  createdAt: Timestamp;
}

export interface CTASettings {
  showTimeSec: number;
  label: string;
  url: string;
}

export interface Webinar {
  id: string;
  tenantId: string;
  title: string;
  youtubeId: string;
  durationSec: number;
  scheduleTime: string; // "HH:mm" format
  ctaSettings?: CTASettings;
  loopProtection: boolean;
  embedAllowedDomains?: string[];
  thumbnailUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form types for creating/updating
export interface WebinarFormData {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  durationSec: number;
  scheduleTime: string;
  thumbnailUrl?: string;
  ctaEnabled: boolean;
  ctaShowTimeSec?: number;
  ctaLabel?: string;
  ctaUrl?: string;
  loopProtection: boolean;
}

// Webinar state types
export type WebinarState = 'BEFORE' | 'ON_AIR' | 'ENDED';

export interface WebinarStateResult {
  state: WebinarState;
  seekPosition?: number;
  remainingSeconds?: number;
}

// YouTube info response
export interface YouTubeVideoInfo {
  title: string;
  thumbnailUrl: string;
  durationSec: number;
}

// Server time response
export interface ServerTimeResponse {
  serverTime: string;
  timestamp: number;
}
