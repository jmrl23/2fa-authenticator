import { cookies } from 'next/headers';
import MainView from './MainView';
import AuthView from './AuthView';

export default function Page() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('authKey');
  const authKey = authCookie?.value;

  return (
    <main className='max-w-screen-sm md:mx-auto'>
      {authKey ? <MainView authKey={authKey} /> : <AuthView />}
    </main>
  );
}
