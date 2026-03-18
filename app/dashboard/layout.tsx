import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session || session.user.role !== 'RESTAURANT_OWNER') {
    redirect('/');
  }
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}