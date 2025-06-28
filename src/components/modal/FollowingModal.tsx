'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Following = {
    id: string;
    createdAt: Date;
    followerId: string;
    followingId: string;
};

export default function FollowingModal({
    following,
    title,
}: {
    following: Following[];
    title: string;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-blue-600 underline">View {title}</button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {following.length === 0 ? (
                    <p className="text-gray-500">No following found.</p>
                ) : (
                    <ul>
                        {following.map((f) => (
                            <li key={f.id} className="border-b py-1">
                                Follower ID: {f.followerId} - Following ID: {f.followingId}
                            </li>
                        ))}
                    </ul>
                )}
            </DialogContent>
        </Dialog>
    );
}
