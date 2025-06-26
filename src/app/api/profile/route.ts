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
    const { email, username, bio } = body;
  
    try {
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email! },
        data: {
          email,
          name: username,
          bio,
        },
      });
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }