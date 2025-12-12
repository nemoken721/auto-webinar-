/**
 * Get the app domain from environment or window.location
 */
export function getAppDomain(): string {
  // Use environment variable for production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, '');
  }
  // Fallback to window.location.host for local development
  if (typeof window !== 'undefined') {
    return window.location.host;
  }
  return 'auto-webinar.vercel.app';
}

/**
 * Generate embed code for a webinar - iframe style
 */
export function generateEmbedCode(webinarId: string, appDomain?: string, youtubeId?: string): string {
  const domain = appDomain || getAppDomain();
  const embedUrl = `https://${domain}/embed/${webinarId}`;

  return `<iframe
  src="${embedUrl}"
  width="100%"
  height="400"
  style="max-width:640px; aspect-ratio:16/9; border:none; border-radius:12px;"
  allow="autoplay; fullscreen; encrypted-media"
  allowfullscreen
></iframe>`;
}

/**
 * Get the embed URL for a webinar
 */
export function getEmbedUrl(webinarId: string, appDomain: string): string {
  return `https://${appDomain}/embed/${webinarId}`;
}

/**
 * Get the watch URL for a webinar
 */
export function getWatchUrl(webinarId: string, appDomain: string): string {
  return `https://${appDomain}/watch/${webinarId}`;
}
