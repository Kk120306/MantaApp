'use client';

import Link from 'next/link';
import { GiMantaRay } from "react-icons/gi";
import { useSession } from 'next-auth/react';
import { CgProfile } from "react-icons/cg";


const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <div className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
            <div className='container flex items-center justify-between'>
                <Link href='/'>
                    <GiMantaRay />
                </Link>
                {session?.user && (
                    <div>
                        <Link href="/profile">
                            <CgProfile className="text-2xl" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
