"use client";

import { useOptimistic, useTransition } from "react";
import { togglePublish } from "../lib/actions";

export default function TogglePublishButton({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticPublished, setOptimistic] = useOptimistic(
    published,
    (currentState, newState: boolean) => newState,
  );
  const handleToggle = () => {
    startTransition(async () => {
      setOptimistic(!optimisticPublished);
      await togglePublish(id, optimisticPublished);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-1 rounded text-sm transition-colors cursor-pointer ${optimisticPublished ? "bg-green-900 text-green-300 hover:bg-green-800" : "bg-orange-700 text-yellow hover:bg-orange-900"}`}
    >
      {optimisticPublished ? "Опубликован" : "Черновик"}
    </button>
  );
}
