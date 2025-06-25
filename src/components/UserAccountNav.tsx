'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

const UserAccountNav = ({ user }: { user: User }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">{user.name}</span>
            <Button
                variant='destructive'
                onClick={() =>
                    signOut({
                        redirect: true,
                        callbackUrl: `${window.location.origin}/sign-in`,
                    })
                }
            >
                Sign out
            </Button>
        </div>
    );
};

export default UserAccountNav;
