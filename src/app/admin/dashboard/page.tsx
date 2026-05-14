import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/admin');

  return <AdminDashboardClient />;
}
