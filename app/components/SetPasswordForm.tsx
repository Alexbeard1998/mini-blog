'use client';

import { useState } from 'react';
import { setPassword } from '@/app/lib/actions';

export default function SetPasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [error, setError] = useState('');

 const handleSubmit = async (formData: FormData) => {
  setError('');
  
  try {
    await setPassword(formData);
    // После успеха просто обновим страницу
    window.location.reload();
  } catch (err) {
    setError((err as Error).message);
  }
};

  return (
    <div className="mt-6 p-4 bg-surface rounded-lg">
      <h2 className="text-lg font-semibold mb-3">
        {hasPassword ? 'Изменить пароль' : 'Установить пароль'}
      </h2>
      
      {!hasPassword && (
        <p className="text-sm text-text-muted mb-3">
          У вас нет пароля. Установите его, чтобы входить без GitHub.
        </p>
      )}

      <form action={handleSubmit} className="space-y-3">
        <input
          type="password"
          name="password"
          placeholder="Новый пароль (минимум 6 символов)"
          required
          minLength={6}
          className={`w-full px-3 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-border'
          }`}
        />
        {error && <span className="text-sm text-red-400">{error}</span>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}