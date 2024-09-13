import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '2FA Authenticator',
  description: 'Authenticator application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body className={cn(inter.className, 'font-sans')}>
        <main className='max-w-screen-sm md:mx-auto'>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
