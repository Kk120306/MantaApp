import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: {
            id: true,
            following: {
                select: {
                    followingId: true,
                },
            },
        },
    });

    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const followingIds = currentUser.following.map((f) => f.followingId);

    const posts = await prisma.post.findMany({
        where: {
            authorId: {
                in: followingIds,
            },
        },
        include: {
            author: {
                select: {
                    username: true,
                },
            },
            likes: true,
            retweets: true,
            comments: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(posts);
}