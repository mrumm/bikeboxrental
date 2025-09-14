import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Container, Box } from '@mui/material';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const isAuthenticated = sessionCookie?.value === 'authenticated';

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}