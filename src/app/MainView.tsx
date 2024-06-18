'use client';

import useAuthenticators from '@/hooks/useAuthenticators';
import Header from './Header';
import Authenticators from './Authenticators';
import { Loader2Icon } from 'lucide-react';

export default function MainView(props: Props) {
  const {
    data: authenticators,
    isLoading,
    isValidating,
    mutate,
  } = useAuthenticators();

  return (
    <>
      <Header isValidating={!isLoading && isValidating} mutate={mutate} />
      {isLoading && (
        <p className='bg-gray-100 p-4 rounded m-4 text-gray-700 font-bold border flex items-center gap-x-2'>
          <Loader2Icon className='animate-spin' />
          Loading..
        </p>
      )}
      {!isLoading && authenticators && (
        <Authenticators authenticators={authenticators} mutate={mutate} />
      )}
    </>
  );
}

interface Props {
  authKey: string;
}
