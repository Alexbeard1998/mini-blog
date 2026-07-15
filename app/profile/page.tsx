import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SetPasswordForm from '@/app/components/SetPasswordForm';
import { prisma } from '@/app/lib/prisma';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { accounts: true },
  });

  const hasPassword = !!user?.password;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>
      
      <div className="p-4 bg-surface rounded-lg space-y-2">
        <p><span className="text-text-muted">Имя:</span> {user?.name || 'Не указано'}</p>
        <p><span className="text-text-muted">Email:</span> {user?.email || 'Не указан'}</p>
        <p>
          <span className="text-text-muted">Способы входа:</span>{' '}
          {[
            hasPassword && 'Пароль',
            ...(user?.accounts || []).map((a) => a.provider),
          ]
            .filter(Boolean)
            .join(', ')}
        </p>
      </div>

      <SetPasswordForm hasPassword={hasPassword} />
    </div>
  );
}