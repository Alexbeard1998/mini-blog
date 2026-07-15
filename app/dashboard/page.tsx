import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";


export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Все посты текущего пользователя (и черновики, и опубликованные)
  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <Link
          href="/dashboard/create"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Новый пост
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-text-muted text-center mt-10">У вас пока нет постов</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block p-4 bg-surface rounded-lg hover:ring-2 hover:ring-yellow-400 transition-all"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                {!post.published && (
                  <div className="mt-4 px-3 py-1 bg-yellow-900 text-yellow-300 text-sm rounded inline-block">
                    Черновик
                  </div>
                )}
              </div>
              <p className="text-sm text-text-muted mt-1">
                {new Date(post.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
