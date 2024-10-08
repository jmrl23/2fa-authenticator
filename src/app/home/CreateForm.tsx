'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function CreateForm(props: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      key: '',
      platform: '',
      description: '',
    },
    resolver: zodResolver(formSchema),
  });
  const [cookies] = useCookies(['authKey']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  async function onSubmit(formData: z.infer<typeof formSchema>) {
    if (isLoading) return;
    setIsLoading(true);
    if (!formData.description) delete formData.description;
    formData.key = formData.key.trim();
    try {
      await api.post<{ data: Authenticator }>(
        '/authenticators/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.authKey}`,
          },
        },
      );
      toast.success('Authenticator created!');
      props.mutate();
    } catch (error) {
      console.error(Error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
      closeButtonRef.current?.click();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className='font-extrabold text-2xl mb-4'>Create authenticator</h1>
        <FormField
          name='platform'
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Platform <span className='text-red-500 font-extrabold'>*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='Facebook' {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name='description'
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Aa' {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name='key'
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Key <span className='text-red-500 font-extrabold'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className='resize-none'
                  placeholder='...'
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-4 mt-4'>
          <DialogClose asChild>
            <Button
              variant={'secondary'}
              type='button'
              ref={closeButtonRef}
              title='cancel'
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <span className='inline-flex gap-x-2 items-center'>
                <Loader2Icon className='animate-spin' />
                Creating
              </span>
            ) : (
              'Confirm'
            )}{' '}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const formSchema = z.object({
  key: z
    .string({
      message: 'key must be a string',
    })
    .min(1, {
      message: 'key must contain at least 1 character(s)',
    }),
  platform: z
    .string({
      message: 'platform must be a string',
    })
    .min(1, {
      message: 'platform must contain at least 1 character(s)',
    }),
  description: z
    .string({
      message: 'description must be a string',
    })
    .optional(),
});

interface Props {
  mutate: () => void;
}
