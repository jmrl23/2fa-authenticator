import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Loader2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';

export default function DeleteForm(props: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies(['authKey']);

  async function handleConfirm() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/authenticators/delete/${props.authenticator.id}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${cookies.authKey}`,
          },
        },
      );
      const data: { authenticator: Authenticator } | ResponseErrorType =
        await response.json();
      if ('error' in data) throw new Error(data.message);
      props.mutate();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
      closeButtonRef.current?.click();
    }
  }

  return (
    <div>
      <h1 className='font-extrabold text-2xl mb-4'>Delete authenticator</h1>
      <p className='mb-4'>
        Are you sure you want to remove the selected authenticator?
      </p>
      <div className='flex justify-end items-center space-x-4'>
        <DialogClose asChild>
          <Button title='cancel' variant={'secondary'} ref={closeButtonRef}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          title='confirm'
          variant={'destructive'}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='inline-flex gap-x-2 items-center'>
              <Loader2Icon className='animate-spin' />
              Deleting
            </span>
          ) : (
            'Confirm'
          )}
        </Button>
      </div>
    </div>
  );
}

interface Props {
  authenticator: Authenticator;
  mutate: () => void;
}
