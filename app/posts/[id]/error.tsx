'use client'


import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Ошибка поста:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold text-red-400">Не удалось загрузить пост</h2>
      <p className="mt-2 text-text-muted">
        {error.message || 'Произошла ошибка при загрузке поста.'}
      </p>
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-surface rounded-lg hover:brightness-90 transition-colors inline-block"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}