import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import DeletePostButton from "@/app/components/DeleteButton";
import TogglePublishButton from "@/app/components/TogglePublishButton";
import Image from "next/image";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  // Пост не найден или это черновик не автора
  if (!post) {
    notFound();
  }

  // Если пост не опубликован — показываем только автору
  if (!post.published && post.authorId !== session?.user?.id) {
    notFound();
  }

  const isAuthor = session?.user?.id === post.authorId;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-4">
        <Link href="/" className="text-blue-400 hover:underline text-sm block">
          ← На главную
        </Link>
        {isAuthor && (
          <Link
            href="/dashboard"
            className="text-blue-400 hover:underline text-sm block"
          >
            ← В дашборд
          </Link>
        )}
      </div>
{post.imageUrl && (
  <div className="relative w-full aspect-[16/9] mb-6 rounded-lg overflow-hidden">
    <Image
      src={post.imageUrl}
      alt={post.title}
      fill
      sizes="(max-width: 768px) 100vw, 672px"
      
      className="object-cover"
      loading="eager"
    />
  </div>
)}
      <div className="flex justify-between items-start mt-4">
        
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {isAuthor && (
          <div className="flex gap-2 shrink-0">
            <TogglePublishButton id={post.id} published={post.published} />
            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className="px-3 py-1 bg-yellow-600 rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              ✏️ Редактировать
            </Link>
            <DeletePostButton id={post.id} />
          </div>
        )}
      </div>

      <p className="text-sm text-text-muted mt-2">
        {post.author?.name || post.author?.email} •
        {new Date(post.createdAt).toLocaleDateString("ru-RU")}
      </p>

     

      <div className="mt-6 text-text-muted whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </div>
  );
}
