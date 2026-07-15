"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchForm = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (query.trim()) {
    router.push(`/?search=${encodeURIComponent(query.trim())}`);
  } else {
    router.push("/");
  }
};
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск постов"
          className="flex-1 px-3 py-2 bg-gray-800 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-text"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Искать
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
