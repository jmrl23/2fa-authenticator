'use client';

import { LogOutIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/shared/utils';

export default function Header(props: Props) {
  const [, , deleteCookie] = useCookies(['authKey']);
  const router = useRouter();

  function logOut() {
    deleteCookie('authKey');
    router.refresh();
  }

  return (
    <header className='p-4 bg-background shadow rounded-b'>
      <div className='flex items-center justify-between space-x-4'>
        <h1 className='font-extrabold text-lg'>Authenticator</h1>
        <div className='flex space-x-4'>
          <Button variant={'default'} title='create'>
            <PlusIcon />
          </Button>
          <Button variant={'secondary'} title='refresh'>
            <RefreshCwIcon
              className={cn(props.isValidating && 'animate-spin')}
              onClick={() => props.mutate()}
            />
          </Button>
          <Button variant={'destructive'} onClick={logOut} title='logout'>
            <LogOutIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}

interface Props {
  isValidating: boolean;
  mutate: () => void;
}
