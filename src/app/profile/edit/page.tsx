import EditProfileForm from '@/components/form/EditProfileForm';

const Page = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <EditProfileForm />
        </div>
    );
}

export default Page;