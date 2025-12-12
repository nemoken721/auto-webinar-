import { NextRequest, NextResponse } from 'next/server';
import { parseISO8601Duration, getYouTubeThumbnail } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      // Fallback: Return thumbnail from known pattern, duration needs manual input
      return NextResponse.json({
        title: '',
        thumbnailUrl: getYouTubeThumbnail(videoId),
        durationSec: 0,
        needsManualInput: true,
      });
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items?.length) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = data.items[0];
    const durationSec = parseISO8601Duration(video.contentDetails.duration);

    return NextResponse.json({
      title: video.snippet.title,
      thumbnailUrl:
        video.snippet.thumbnails.maxres?.url ||
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.default?.url,
      durationSec,
      needsManualInput: false,
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to fetch video info' }, { status: 500 });
  }
}
