import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createPost } from "@/app/lib/actions";
import Link from "next/link";

export default async function CreatePostPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Новый пост</h1>

      <form action={createPost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
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
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Обложка поста (необязательно)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-surface file:text-text hover:file:brightness-90"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm">
            Опубликовать сразу
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors"
          >
            Создать
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-surface rounded-lg hover:brightness-90 transition-colors"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
