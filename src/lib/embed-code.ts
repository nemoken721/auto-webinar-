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
 * Generate embed code for a webinar - link button style (responsive)
 */
export function generateEmbedCode(webinarId: string, appDomain?: string, youtubeId?: string): string {
  const domain = appDomain || getAppDomain();
  const watchUrl = `https://${domain}/watch/${webinarId}`;
  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : '';

  return `<style>
.webinar-embed{max-width:640px;margin:0 auto}
.webinar-embed a{display:block;position:relative;text-decoration:none}
.webinar-embed .video-container{position:relative;padding-bottom:56.25%;background:#000;border-radius:8px;overflow:hidden}
.webinar-embed img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.7)}
.webinar-embed .live-badge{position:absolute;top:6px;left:6px;background:rgba(255,0,0,0.9);color:white;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:bold}
.webinar-embed .play-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.webinar-embed .play-circle{width:48px;height:48px;background:rgba(255,0,0,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px}
.webinar-embed .play-circle svg{width:20px;height:20px}
.webinar-embed .play-text{color:white;font-size:12px;font-weight:bold;text-shadow:0 1px 3px rgba(0,0,0,0.5)}
@media(min-width:640px){
.webinar-embed .video-container{border-radius:12px}
.webinar-embed .live-badge{top:12px;left:12px;padding:4px 12px;border-radius:4px;font-size:14px}
.webinar-embed .play-circle{width:80px;height:80px;margin:0 auto 16px}
.webinar-embed .play-circle svg{width:32px;height:32px}
.webinar-embed .play-text{font-size:20px}
}
</style>
<div class="webinar-embed">
<a href="${watchUrl}" target="_blank" rel="noopener noreferrer">
<div class="video-container">
${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="ウェビナー">` : ''}
<div class="live-badge">● LIVE</div>
<div class="play-btn">
<div class="play-circle"><svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>
<div class="play-text">クリックして視聴する</div>
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
