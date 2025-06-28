// app/api/profile/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, username, bio } = body;

    try {
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email! },
            data: {
                name,
                email,
                username,
                bio,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                bio: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
