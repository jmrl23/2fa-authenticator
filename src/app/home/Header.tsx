'use client';

import { LogOutIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CreateForm from './CreateForm';

export default function Header(props: Props) {
  const [, , deleteCookie] = useCookies(['authKey']);
  const router = useRouter();

  function logOut() {
    deleteCookie('authKey');
    router.refresh();
  }

  return (
    <header className='p-4 bg-background shadow rounded-b sticky top-0'>
      <div className='flex items-center justify-between space-x-4'>
        <h1 className='font-extrabold text-lg'>2FA</h1>
        <div className='flex space-x-4'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'default'} title='create'>
                <PlusIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CreateForm mutate={props.mutate} />
            </DialogContent>
          </Dialog>
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
