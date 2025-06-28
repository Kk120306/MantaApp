import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = 8;

    const following = await prisma.follow.findMany({
        where: {
            follower: {
                email: session.user.email!,
            },
        },
        select: {
            followingId: true,
        },
    });

    const followingIds = following.map((f) => f.followingId);


    const users = await prisma.user.findMany({
        take: limit,
        where: {
            id: {
                notIn: [session.user.id, ...followingIds],
            },
        },
        select: {
            id: true,
            name: true,
            username: true,
        },
    });


    return NextResponse.json(users);
}
