'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Textarea } from '../ui/Textarea';

const FormSchema = z.object({
    content: z.string().min(1, 'Some Content is required'),
    authorId: z.string().nonempty(),
});

const CreatePostForm = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: '',
            authorId: '',
        },
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            form.setValue('authorId', session.user.id);
        }
    }, [session?.user?.id, form]);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            const res = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                throw new Error("Failed to create post");
            }

            const newPost = await res.json();
            console.log("New Post:", newPost);
            router.push('/');
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                <div className='space-y-2'>
                    <FormField
                        control={form.control}
                        name='content'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Share what’s happening...'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className='w-full mt-6' type='submit'>
                    Post
                </Button>
            </form>
        </Form>
    );
};

export default CreatePostForm;
