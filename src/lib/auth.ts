import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
                    },
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
                    email: existingUser.email,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            if (trigger === "update" && session) {
                token.email = session.email;
            }

            if (token.id && (!token.email || token.email === null)) {
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { email: true },
                    });

                    if (user) {
                        token.email = user.email;
                    }
                } catch (error) {
                    console.error("Error fetching user email:", error);
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
                    email: token.email as string,
                },
            };
        },
    },
};
