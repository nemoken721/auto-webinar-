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
 * Generate embed code for a webinar
 */
export function generateEmbedCode(webinarId: string, appDomain?: string): string {
  const domain = appDomain || getAppDomain();
  const embedUrl = `https://${domain}/embed/${webinarId}`;

  return `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;">
  <iframe src="${embedUrl}"
    style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
    allow="autoplay; fullscreen; encrypted-media; accelerometer; gyroscope; clipboard-write; web-share"
    allowfullscreen>
  </iframe>
</div>`;
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
