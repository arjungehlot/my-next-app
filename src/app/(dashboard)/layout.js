import { getSessionUser } from '@/app/actions';
import DashboardLayoutClient from '@/components/DashboardLayoutClient';

export default async function DashboardLayout({ children }) {
  const user = await getSessionUser();
  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
