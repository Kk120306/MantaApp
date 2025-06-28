import CreatePostForm from "@/components/form/CreatePostForm";

const Page = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>
            <CreatePostForm />
        </div>
    );
}

export default Page;