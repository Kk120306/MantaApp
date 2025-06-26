import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiMantaRay } from "react-icons/gi";
import Link from "next/link";


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <p>Please sign in to view your profile.</p>;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            posts: true,
            _count: {
                select: {
                    followers: true,
                    following: true,
                },
            },
        },
    });

    if (!user) {
        return <p>User not found.</p>;
    }

    return (
        <div>
            <GiMantaRay />
            <Link href="/profile/edit">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
            </Link>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Username: {user?.username}</p>
            <h2>{`Followers: ${user._count.followers}`}</h2>
            <h2>{`Following: ${user._count.following}`}</h2>
            <h2>Your Posts</h2>
            <p>Bio : {user?.bio}</p>
            <ul>
                {user.posts.map((post) => (
                    <li key={post.id}>{post.content}</li>
                ))}
            </ul>
        </div>
    );
}