'use client'
import { deletePost } from "../lib/actions";
import { useTransition } from "react";

export default function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = confirm("Удалить пост? Это действие необратимо.");
    if (!confirmed) return;

    startTransition(async () => {
      await deletePost(id);
    });
  };
  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`px-3 py-1 rounded text-sm transition-colors cursor-pointer ${isPending ? "bg-surface cursor-not-allowed" : "bg-red-600 hover:bg-red-800"}`}
    >
      {isPending ? "Удаление..." : "Удалить"}
    </button>
  );
}
