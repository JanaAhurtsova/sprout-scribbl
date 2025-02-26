import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Nav from '@/components/navigation/nav';
import './globals.css';
import { ThemeProvider } from '@/components/providers/themes';

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sprout & Scribble',
  description: 'Online store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <div className='mx-auto max-w-8xl flex-grow px-6 md:px-12'>
            <Nav />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
