import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { updatePost } from "@/app/lib/actions";
import Link from "next/link";
import Image from "next/image";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== session.user.id) {
    notFound();
  }

  const updatePostWithId = updatePost.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Редактирование поста</h1>

      <form action={updatePostWithId} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={post.title}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Содержимое
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            defaultValue={post.content}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Текущая обложка */}
        {post.imageUrl && (
          <div className="relative w-48 aspect-[5/3]">
            <Image
              src={post.imageUrl}
              alt="Обложка"
              fill
              sizes="200px"
              priority
              
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Загрузка новой обложки */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Новая обложка (необязательно)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-surface file:text-text hover:file:brightness-90"
          />
        </div>

        {/* Чекбокс удаления обложки */}
        {post.imageUrl && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeImage"
              name="removeImage"
              className="w-4 h-4"
            />
            <label htmlFor="removeImage" className="text-sm text-red-400">
              Удалить обложку
            </label>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={post.published}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm">
            Опубликовать
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Сохранить
          </button>
          <Link
            href={`/posts/${id}`}
            className="px-4 py-2 bg-surface rounded-lg hover:brightness-90 transition-colors"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
