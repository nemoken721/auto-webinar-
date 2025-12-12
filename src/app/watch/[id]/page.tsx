import { notFound } from 'next/navigation';
import { getWebinar } from '@/lib/firebase';
import { WebinarPlayer } from '@/components/player';
import type { Webinar } from '@/types';

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
}

// Convert Firestore Timestamp to serializable format
function serializeWebinar(webinar: Webinar) {
  // Use JSON stringify/parse to convert Timestamps to plain objects
  return JSON.parse(JSON.stringify(webinar));
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const webinar = await getWebinar(id);

  if (!webinar) {
    notFound();
  }

  // Serialize webinar to avoid Timestamp serialization issues
  const serializedWebinar = serializeWebinar(webinar);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-5xl webinar-page-container">
        <WebinarPlayer webinar={serializedWebinar} isPreview={isPreview} />
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';
