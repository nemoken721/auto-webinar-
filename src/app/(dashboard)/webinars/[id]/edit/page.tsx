'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getWebinar } from '@/lib/firebase';
import { WebinarForm } from '@/components/dashboard';
import type { Webinar } from '@/types';

export default function EditWebinarPage() {
  const params = useParams();
  const id = params.id as string;
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWebinar() {
      try {
        const data = await getWebinar(id);
        setWebinar(data);
      } catch (error) {
        console.error('Failed to fetch webinar:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchWebinar();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">ウェビナーが見つかりません</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ウェビナー編集</h1>
        <p className="text-gray-500 mt-1">{webinar.title}</p>
      </div>

      <WebinarForm mode="edit" webinar={webinar} />
    </div>
  );
}
