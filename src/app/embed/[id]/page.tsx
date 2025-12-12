import { notFound } from 'next/navigation';
import { getWebinar } from '@/lib/firebase';
import { WebinarPlayer } from '@/components/player';
import type { Webinar } from '@/types';

interface EmbedPageProps {
  params: Promise<{ id: string }>;
}

// Convert Firestore Timestamp to serializable format
function serializeWebinar(webinar: Webinar) {
  return JSON.parse(JSON.stringify(webinar));
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { id } = await params;
  const webinar = await getWebinar(id);

  if (!webinar) {
    notFound();
  }

  const serializedWebinar = serializeWebinar(webinar);

  return (
    <main className="w-full h-screen bg-black">
      <WebinarPlayer webinar={serializedWebinar} isEmbed={true} />
    </main>
  );
}

export const dynamic = 'force-dynamic';
