import { auth } from '@/server/auth';
import { ROLES } from '@/types/roles';
import { redirect } from 'next/navigation';

export default async function UserPage({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user.role !== ROLES.ADMIN) return redirect('/dashboard/settings');

  return children;
}
