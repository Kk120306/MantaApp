import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { FaRegHeart, FaRetweet, FaReply } from "react-icons/fa";


type PostProps = {
    post: {
        id: string;
        createdAt: Date;
        content: string;
        author: {
            username: string | null;
        };
        likes: {
            createdAt: Date;
            id: string;
            userId: string;
            postId: string;
        }[];
        retweets: {
            createdAt: Date;
            id: string;
            userId: string;
            postId: string;
        }[];
        comments: {
            createdAt: Date;
            content: string;
            id: string;
            authorId: string;
            postId: string;
        }[];
    };
};

export default function PostCard({ post }: PostProps) {
    const { createdAt, content, likes, retweets, author } = post;
    const username = author?.username ?? "unknown";

    return (
        <Card className="max-w-xl mx-auto mb-4">
            <CardHeader className="flex items-center space-x-4">
                <Avatar>
                    <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base font-semibold">{username}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        @{username} · {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <p className="mb-4">{content}</p>
                <div className="flex space-x-8 text-gray-500">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <FaReply /> <span>Reply</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <FaRetweet /> <span>{retweets.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <FaRegHeart /> <span>{likes.length}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
