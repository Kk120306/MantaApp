'use client'

import {
    Home,
    Search,
    Mail,
    Heart,
    User,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GiMantaRay } from "react-icons/gi";
import { signOut } from "next-auth/react";


const links = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Heart, label: "Likes", href: "/likes" },
    { icon: User, label: "Profile", href: "/profile" },
];


export default function TwitterSidebar() {

    const { data: session, status } = useSession();

    return (
        <aside className="flex flex-col justify-between w-20 md:w-64 border-r border-gray-200 bg-white px-2 md:px-4 py-4 h-[calc(100vh-64px)]">
            <div className="space-y-4">
                <Link href='/'>
                    <GiMantaRay />
                </Link>                {links.map(({ icon: Icon, label, href }) => (
                    <Button
                        key={label}
                        variant="ghost"
                        asChild
                        className="w-full justify-start gap-4 px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                        <Link href={href}>
                            <Icon className="h-5 w-5" />
                            <span className="hidden md:inline">{label}</span>
                        </Link>
                    </Button>
                ))}
                <Button
                    className="w-full md:w-11/12 mt-4 font-bold rounded-full py-2"
                    variant="default"
                    asChild
                >
                    <Link href="/post/create">
                        <span className="hidden md:inline">Post</span>
                        <span className="md:hidden text-xl">+</span>
                    </Link>
                </Button>
            </div>

            <div className="pt-4 border-t">
                {status === 'loading' ? null : session?.user ? (
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 px-3 py-2 text-base text-gray-600 hover:bg-gray-100"
                        onClick={() =>
                            signOut({
                                redirect: true,
                                callbackUrl: `${window.location.origin}/sign-in`,
                            })
                        }
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="hidden md:inline">Logout</span>
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 px-3 py-2 text-base text-gray-600 hover:bg-gray-100"
                        asChild
                    >
                        <Link href="/sign-in">
                            <LogOut className="h-5 w-5" />
                            <span className="hidden md:inline">Sign In</span>
                        </Link>
                    </Button>
                )}
            </div>
        </aside>
    );
}
