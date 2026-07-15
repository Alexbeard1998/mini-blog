'use client';

import { toggleTheme } from '@/app/lib/actions';

export default function ThemeToggle({ theme }: { theme: string }) {
  return (
    <form action={() => toggleTheme(theme)}>
      <button
        type="submit"
        className="text-sm text-text-muted hover:text-white transition-colors"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </form>
  );
}