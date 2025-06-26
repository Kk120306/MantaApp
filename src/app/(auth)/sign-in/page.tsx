import SignInForm from '@/components/form/SignInForm';
import { GiMantaRay } from "react-icons/gi";


const page = () => {
    return (
        <div className='w-full'>
            <GiMantaRay className='text-6xl text-center mt-10 mb-5' />
            <SignInForm />
        </div>
    );
};

export default page;
