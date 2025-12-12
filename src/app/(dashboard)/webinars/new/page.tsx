'use client';

import { WebinarForm } from '@/components/dashboard';

export default function NewWebinarPage() {
  return (
    <div className="p-4 pt-16 md:pt-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold">ウェビナー新規作成</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">新しいウェビナーを設定します</p>
      </div>

      <WebinarForm mode="create" />
    </div>
  );
}
