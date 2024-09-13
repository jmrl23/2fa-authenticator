import Main from '@/app/home/Main';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Page() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('authKey');
  const authKey = authCookie?.value;

  if (!authKey) return redirect('/');

  return <Main />;
}
