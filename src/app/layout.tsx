import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/shared/utils';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Authenticator',
  description: 'Personal authenticator application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body className={cn(inter.className, 'font-sans')}>{children}</body>
    </html>
  );
}
