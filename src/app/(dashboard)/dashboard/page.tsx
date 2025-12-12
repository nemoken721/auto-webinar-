'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getWebinarsByTenant } from '@/lib/firebase';
import { WebinarCard } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import type { Webinar } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebinars = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getWebinarsByTenant(user.uid);
      setWebinars(data);
    } catch (error) {
      console.error('Failed to fetch webinars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchWebinars();
    }
  }, [user?.uid]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">ダッシュボード</h1>
          <p className="text-gray-500 mt-1">ウェビナーの管理</p>
        </div>
        <Link href="/webinars/new">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規作成
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : webinars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ウェビナーがありません
          </h3>
          <p className="text-gray-500 mb-6">
            最初のウェビナーを作成しましょう
          </p>
          <Link href="/webinars/new">
            <Button>新規作成</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((webinar) => (
            <WebinarCard
              key={webinar.id}
              webinar={webinar}
              onDelete={fetchWebinars}
            />
          ))}
        </div>
      )}
    </div>
  );
}
