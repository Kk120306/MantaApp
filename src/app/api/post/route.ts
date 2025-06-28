import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, authorId } = body;

        if (!content || !authorId) {
            return NextResponse.json({ user: null, error: "Missing values" }, { status: 409 });
        }

        const newPost = await prisma.post.create({
            data: {
                content,
                authorId,
            },
        });

        return NextResponse.json({ Post: newPost, message: "User created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


export async function GET() {
    const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              username: true,
            },
          },
          likes: true,
          comments: true,
          retweets: true, 
        },
        orderBy: { createdAt: "desc" },
      });
      


    return NextResponse.json(posts);
}