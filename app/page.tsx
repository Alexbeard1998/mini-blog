import { auth } from "@/auth";
import Link from "next/link";
import { Suspense } from "react";
import PostList from "./components/PostList";
import PostListSkeleton from "./components/PostListSkeleton";
import SearchForm from "./components/SearchForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam, search } = await searchParams as { page?: string; search?: string };
  const page = Number(pageParam) || 1;
  const session = await auth();

  return (
    <div>
      {session ? (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Привет, {session.user?.name || "пользователь"}!
          </h1>
          <Link
            href="/dashboard/create"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors"
          >
            + Новый пост
          </Link>
        </div>
      ) : (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold mb-4">
            Добро пожаловать в мини-блог
          </h1>
          <p className="text-text-muted mb-6">
            Войдите, чтобы создавать и управлять постами.
          </p>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors"
          >
            Войти
          </Link>
        </div>
      )}

   {/* Поиск — доступен всем */}
<div className="mt-4 mb-6">
  <Suspense fallback={<div className="h-10 bg-surface rounded-lg animate-pulse" />}>
    <SearchForm />
  </Suspense>
</div>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList page={page} search={search} />
      </Suspense>
    </div>
  );
}
