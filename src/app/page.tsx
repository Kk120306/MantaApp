'use client';

import { useSession } from "next-auth/react";
import PostCard from "@/components/ui/PostCard";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Post = {
    id: string;
    content: string;
    createdAt: string; 
    author: {
        username: string | null;
    };
    likes: {
        id: string;
        userId: string;
        postId: string;
        createdAt: string;
    }[];
    retweets: {
        id: string;
        userId: string;
        postId: string;
        createdAt: string;
    }[];
    comments: {
        id: string;
        content: string;
        authorId: string;
        postId: string;
        createdAt: string;
    }[];
};


export default function HomePage() {
    const { data: session, status } = useSession();

    const [activeTab, setActiveTab] = useState<'recent' | 'following'>('recent');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        const fetchPosts = async () => {
            setLoading(true);
            const res = await fetch(
                activeTab === 'recent' ? '/api/post' : '/api/post/following'
            );
            const data = await res.json();
            setPosts(data);
            setLoading(false);
        };

        fetchPosts();
    }, [activeTab, status]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div className='text-center py-20'>
                <h1 className='text-5xl font-bold mb-6'>Welcome to Manta</h1>
                <p className='text-lg text-zinc-400 mb-4'>A microblogging platform for your thoughts.</p>
                <Link className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg" href='/sign-in'>
                    Get Started
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex justify-center gap-6 border-b pb-4 font-semibold text-lg">
                <Button
                    variant="ghost"
                    className={activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : ''}
                    onClick={() => setActiveTab('recent')}
                >
                    Recent
                </Button>
                <Button
                    variant="ghost"
                    className={activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : ''}
                    onClick={() => setActiveTab('following')}
                >
                    Following
                </Button>
            </div>

            <div className="mt-6 space-y-4">
                {loading ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p>No posts found.</p>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            username={post.author.username}
                        />
                        // TODO : Fix type error : I dont know why its wrong>>>>
                    ))
                )}
            </div>
        </div >
    );
}
