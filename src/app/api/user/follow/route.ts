import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action } = await req.json();

    if (!userId || !action || !["follow", "unfollow"].includes(action)) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    try {
        if (action === "follow") {
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: userId,
                },
            });
            return NextResponse.json({ message: "Followed successfully" });
        } else if (action === "unfollow") {
            await prisma.follow.deleteMany({
                where: {
                    followerId: session.user.id,
                    followingId: userId,
                },
            });
            return NextResponse.json({ message: "Unfollowed successfully" });
        }
    } catch (error) {
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}
