'use client';

import Authenticators from '@/app/home/Authenticators';
import Header from '@/app/home/Header';
import useAuthenticators from '@/hooks/useAuthenticators';
import { LoaderIcon } from 'lucide-react';

export default function Main() {
  const {
    data: authenticators,
    mutate,
    isLoading,
    isValidating,
  } = useAuthenticators();

  if (isLoading) {
    return (
      <div className='p-4'>
        <p className='flex gap-x-2 font-extrabold items-center text-foreground'>
          <LoaderIcon className='animate-spin w-6 h-6' />
          Loading, please wait..
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header mutate={mutate} isValidating={isValidating} />
      <Authenticators authenticators={authenticators} mutate={mutate} />
    </div>
  );
}
