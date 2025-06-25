import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Page = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg">You must be signed in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg">Welcome to the admin dashboard!</p>
            <div>{session?.user.username || session.user.name}</div>
        </div>
    );
}

export default Page;