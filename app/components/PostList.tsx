import Image from "next/image";
import { prisma } from "../lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 5; // Постов на странице
export default async function PostList({
  page,
  search,
}: {
  page: number;
  search?: string;
}) {
   const where = {
    published: true,
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {}),
  };
  // Считаем общее количество опубликованных постов
  const totalPosts = await prisma.post.count({
    where,
  });

  // Сколько всего страниц
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  // Сколько постов пропустить
  const skip = (page - 1) * PAGE_SIZE;

  // Получаем посты для текущей страницы
 const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: PAGE_SIZE,
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  if (posts.length === 0) {
    return (
      <p className="text-text-muted text-center mt-10">
        {search ? 'Ничего не найдено' : 'Постов пока нет'}
      </p>
    );
  }
  return (
  <div>
    {search&&(<p className="text-text-muted mb-4">
      Результаты по запросу {search}: {totalPages}
    </p>)}
    <div className="space-y-4 mt-6">
      {posts.map((post) => (
        <article key={post.id} className="p-4 bg-surface rounded-lg">
          {post.imageUrl && (
            <div className="relative w-full aspect-[16/9] mb-3 rounded-lg overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                loading="eager"
                className="object-cover"
              />
            </div>
          )}
          <h2 className="text-xl font-semibold">
            <Link
              href={`/posts/${post.id}`}
              className="hover: text-yellow-400 transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {post.author?.name || post.author?.email} - {` `}{" "}
            {new Date(post.createdAt).toLocaleDateString("ru-RU")}
          </p>
          <p className="text-text mt-2 line-clamp-3">{post.content}</p>
        </article>
      ))}
      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${search?`&search=${search}`:''}`}
              className="px-4 py-2 bg-surface border border-border rounded-lg hover:brightness-90 transition-colors"
            >
              ← Назад
            </Link>
          )}
          <span className="px-4 py-2 text-text-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/?page=${page + 1}${search?`&search=${search}`:''}`}
              className="px-4 py-2 bg-surface border border-border rounded-lg hover:brightness-90 transition-colors"
            >
              Вперёд →
            </Link>
          )}
        </div>
      )}
    </div>
  </div>
    
  );
}
