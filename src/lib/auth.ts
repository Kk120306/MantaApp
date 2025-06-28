import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "john@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    }
                });

                if (!existingUser) {
                    return null;
                }

                if (existingUser.password) {
                    const isValidPassword = await compare(credentials.password, existingUser.password);

                    if (!isValidPassword) {
                        return null;
                    }
                }

                return {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    username: existingUser.username,
                    bio: existingUser.bio ?? '',
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.bio = user.bio;
            }

            // Handle session updates (when user updates profile)
            if (trigger === "update" && session) {
                token.username = session.username;
                token.bio = session.bio;
                token.name = session.name;
                token.email = session.email;
            }

            // For existing tokens, fetch fresh data if needed
            if (token.id && (!token.username || token.username === null)) {
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { username: true, bio: true, name: true, email: true }
                    });

                    if (user) {
                        token.username = user.username;
                        token.bio = user.bio;
                        token.name = user.name;
                        token.email = user.email;
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    username: token.username as string,
                    bio: token.bio as string,
                },
            };
        }
    }
}