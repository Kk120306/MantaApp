'use client';

import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import UserAccountNav from './UserAccountNav';

const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <div className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
            <div className='container flex items-center justify-between'>
                <Link href='/'>
                    <HandMetal />
                </Link>
                {status === 'loading' ? null : session?.user ? (
                    <UserAccountNav user={session.user} />
                ) : (
                    <Link className={buttonVariants()} href='/sign-in'>
                        Sign in
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
