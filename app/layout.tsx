// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { cookies } from 'next/headers';
import ThemeToggle from '@/app/components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Мини-блог',
  description: 'Персональный блог на Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'dark';

  return (
    <html lang="ru" className={theme === 'light' ? 'light' : ''}>
      <body className="min-h-screen bg-bg text-text">
        <header className="border-b border-border p-4">
          <nav className="max-w-4xl mx-auto flex justify-between items-center">
            <Link
              href="/"
              className="font-bold text-xl text-text hover:text-yellow-400 transition-colors"
            >
              📝 Мини-блог
            </Link>

            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <ThemeToggle theme={theme} />
                  <Link
                    href="/dashboard"
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    Дашборд
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    Профиль
                  </Link>
                  <span className="text-sm text-text-muted">
                    {session.user?.name || session.user?.email}
                  </span>
                  <form
                    action={async () => {
                      'use server';
                      await signOut({ redirectTo: '/' });
                    }}
                  >
                    <button
                      type="submit"
                      className="text-sm text-text-muted hover:text-text transition-colors"
                    >
                      Выйти
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Войти
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}