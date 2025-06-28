'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type User = {
    id: string;
    name: string;
    username: string;
};

export default function RandomUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch('/api/user/suggested');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleFollow = async (userId: string) => {
        const isFollowing = followedUserIds.has(userId);
        try {
            const res = await fetch("/api/user/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action: isFollowing ? "unfollow" : "follow" }),
            });

            if (res.ok) {
                setFollowedUserIds((prev) => {
                    const newSet = new Set(prev);
                    if (isFollowing) {
                        newSet.delete(userId);
                    } else {
                        newSet.add(userId);
                    }
                    return newSet;
                });
            } else {
                console.error("Failed to toggle follow");
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    return (
        <Card className="w-full md:w-72 bg-white shadow-sm rounded-xl">
            <CardHeader>
                <CardTitle className="text-lg">Who to follow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {users.length === 0 ? (
                    <p>No one to follow</p>
                ) : (
                    users.map((user) => {
                        const isFollowing = followedUserIds.has(user.id);
                        return (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-gray-500 text-xs">@{user.username}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant={isFollowing ? "default" : "secondary"}
                                    onClick={() => handleToggleFollow(user.id)}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
