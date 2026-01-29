import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'client') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={user.role} />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
