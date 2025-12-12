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
 * Generate embed code for a webinar - link button style
 */
export function generateEmbedCode(webinarId: string, appDomain?: string, youtubeId?: string): string {
  const domain = appDomain || getAppDomain();
  const watchUrl = `https://${domain}/watch/${webinarId}`;
  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : '';

  return `<div style="max-width:640px; margin:0 auto;">
  <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" style="display:block; position:relative; text-decoration:none;">
    <div style="position:relative; padding-bottom:56.25%; background:#000; border-radius:12px; overflow:hidden;">
      ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="ウェビナー" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.7);">` : ''}
      <div style="position:absolute; top:12px; left:12px; background:rgba(255,0,0,0.9); color:white; padding:4px 12px; border-radius:4px; font-size:14px; font-weight:bold;">
        ● LIVE
      </div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center;">
        <div style="width:80px; height:80px; background:rgba(255,0,0,0.9); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div style="color:white; font-size:20px; font-weight:bold; text-shadow:0 2px 4px rgba(0,0,0,0.5);">
          クリックして視聴する
        </div>
      </div>
    </div>
  </a>
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
