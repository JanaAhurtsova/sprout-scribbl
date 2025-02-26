import { auth } from '@/server/auth';
import { UserButton } from './user-button';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';
import Logo from './logo';

export default async function Nav() {
  const session = await auth();
  return (
    <header className='py-8'>
      <nav>
        <ul className='flex items-center justify-between gap-4 md:gap-8'>
          <li className='flex flex-1'>
            <Link href='/' aria-label='sprout and scribble logo'>
              <Logo />
            </Link>
          </li>
          <li className='relative flex items-center hover:bg-muted'></li>
          {!session ? (
            <li className='flex items-center justify-center'>
              <Button asChild>
                <Link className='flex gap-2' href='/login'>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className='flex items-center justify-center'>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
