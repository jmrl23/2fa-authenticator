import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon, PenIcon, TrashIcon } from 'lucide-react';
import ms from 'ms';
import { useState } from 'react';
import toast from 'react-hot-toast';
import UpdateForm from './UpdateForm';
import DeleteForm from './DeleteForm';

export default function Authenticators({ authenticators, mutate }: Props) {
  if (authenticators.length < 1) {
    return (
      <div className='bg-gray-100 p-4 rounded m-4 text-gray-700 font-bold border'>
        You haven&apos;t created a 2FA authenticator in the app yet. Please set
        it up now to enhance your account security.
      </div>
    );
  }

  return (
    <div className='m-4 mb-0'>
      {authenticators.map((authenticator) => (
        <Authenticator
          key={authenticator.id}
          authenticator={authenticator}
          mutate={mutate}
        />
      ))}
    </div>
  );
}

function Authenticator({
  authenticator,
  mutate,
}: {
  authenticator: Authenticator;
  mutate: () => void;
}) {
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  function handleCopy() {
    if (isCopied) return;
    navigator.clipboard.writeText(authenticator.code);
    setIsCopied(true);
    toast.success('Copied');
    setTimeout(() => {
      setIsCopied(false);
    }, ms('2s'));
  }

  return (
    <div className='p-4 bg-background rounded mb-4 shadow'>
      <div className='flex flex-col space-y-2'>
        <h2 className='font-bold'>
          <span className='line-clamp-1'>{authenticator.platform}</span>
        </h2>
        {authenticator.description && (
          <p
            className='text-sm bg-gray-100 p-2 rounded font-bold text-gray-700 border'
            onClick={() => setIsShowMore((value) => !value)}
          >
            <span className={cn(!isShowMore && 'line-clamp-3')}>
              {authenticator.description}
            </span>
          </p>
        )}
      </div>
      <div className='flex items-center justify-between mt-4'>
        <div className='flex space-x-4'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'outline'} title='edit'>
                <PenIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UpdateForm authenticator={authenticator} mutate={mutate} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'destructive'} title='delete'>
                <TrashIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DeleteForm authenticator={authenticator} mutate={mutate} />
            </DialogContent>
          </Dialog>
        </div>
        <div className='flex space-x-4 items-center'>
          <span className='font-mono p-2 font-bold'>{authenticator.code}</span>
          <Button variant={'outline'} title='copy' onClick={handleCopy}>
            {isCopied ? <CheckIcon className='text-green-500' /> : <CopyIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  authenticators: Authenticator[];
  mutate: () => void;
}
