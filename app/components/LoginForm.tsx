"use client"

import { useState } from "react";
import { login, signInWithGitHub } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      await login(formData);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-surface rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>

      <form action={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className={`w-full px-3 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-border"
          }`}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          required
          className={`w-full px-3 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-border"
          }`}
        />
        {error && <span className="text-sm text-red-400 ">{error}</span>}
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors"
        >
          Войти
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface text-text-muted">или</span>
        </div>
      </div>

      <form
        action={signInWithGitHub}
      >
        <button
          type="submit"
          className="w-full py-2 bg-surface rounded-lg hover:brightness-90 transition-colors flex items-center justify-center gap-2"
        >
          <span>Войти через GitHub</span>
        </button>
      </form>

      <p className="text-sm text-text-muted text-center mt-4">
        Нет аккаунта?{" "}
        <a href="/register" className="text-blue-400 hover:underline">
          Зарегистрироваться
        </a>
      </p>
    </div>
  );
}
