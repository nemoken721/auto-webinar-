/**
 * Generate embed code for a webinar
 */
export function generateEmbedCode(webinarId: string, appDomain: string): string {
  const embedUrl = `https://${appDomain}/embed/${webinarId}`;

  return `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;">
  <iframe src="${embedUrl}"
    style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
    allow="autoplay; fullscreen" allowfullscreen>
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
