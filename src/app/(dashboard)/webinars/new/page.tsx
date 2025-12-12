'use client';

import { WebinarForm } from '@/components/dashboard';

export default function NewWebinarPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ウェビナー新規作成</h1>
        <p className="text-gray-500 mt-1">新しいウェビナーを設定します</p>
      </div>

      <WebinarForm mode="create" />
    </div>
  );
}
