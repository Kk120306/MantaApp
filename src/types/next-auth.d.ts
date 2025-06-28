import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        username?: string | null;
    }

    interface Session {
        user: {
            id: string;
            email?: string | null;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
    }
}