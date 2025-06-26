import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import User from '@/components/User';

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className='text-center py-20'>
                <h1 className='text-5xl font-bold mb-6'>Welcome to Manta</h1>
                <p className='text-lg text-zinc-400 mb-4'>A microblogging platform for your thoughts.</p>
                <Link className={buttonVariants({ size: "lg" })} href='/sign-in'>
                    Get Started
                </Link>
            </div>
        );
    }    

    return (
        <div>
            <h1 className='text-4xl'>Home</h1>
            
        </div>
    );
}
