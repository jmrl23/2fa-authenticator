'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AuthView() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      authKey: '',
    },
    resolver: zodResolver(formSchema),
  });
  const [_, setCookie] = useCookies(['authKey']);
  const router = useRouter();

  function onSubmit({ authKey }: z.infer<typeof formSchema>) {
    setCookie('authKey', authKey);
    router.refresh();
  }

  return (
    <div className='min-h-screen flex items-center'>
      <div className='w-full m-4 md:m-0'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='p-4 bg-background rounded shadow'
          >
            <h1 className='font-extrabold text-2xl mb-4'>Checkpoint</h1>
            <p className='bg-gray-100 p-4 rounded mb-4 text-gray-700 font-bold text-sm border'>
              {'Enter your authorization key to access your authenticators.'}
            </p>
            <FormField
              control={form.control}
              name='authKey'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='key'
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <div className='flex justify-end mt-4'>
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

const formSchema = z.object({
  authKey: z.string().min(1),
});
