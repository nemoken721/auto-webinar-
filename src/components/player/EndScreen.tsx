'use client';

import { motion } from 'framer-motion';

interface EndScreenProps {
  message?: string;
  redirectUrl?: string;
}

export function EndScreen({
  message = '本日の配信は終了しました',
  redirectUrl,
}: EndScreenProps) {
  // Auto redirect if URL is provided
  if (redirectUrl && typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center
                 bg-gradient-to-b from-gray-900 to-black"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center px-4"
      >
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-gray-400"
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
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{message}</h2>
        <p className="text-gray-400">
          ご視聴ありがとうございました
        </p>
        {redirectUrl && (
          <p className="mt-4 text-sm text-gray-500">
            まもなくリダイレクトします...
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
