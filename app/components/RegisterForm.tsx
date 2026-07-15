"use client";
import { useState } from "react";
import { register } from "@/app/lib/actions";

export default function RegisterForm() {
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      await register(formData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-surface rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>

      {/* {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )} */}

      <form action={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Имя"
          required
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder={`${error?'Email уже используется':'Email'}`}
          required
          className={`w-full px-3 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-border"
          }`}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль (минимум 6 символов)"
          required
          minLength={6}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Зарегистрироваться
        </button>
      </form>

      <p className="text-sm text-text-muted text-center mt-4">
        Уже есть аккаунт?
        <a href="/login" className="text-blue-400 hover:underline">
          Войти
        </a>
      </p>
    </div>
  );
}
