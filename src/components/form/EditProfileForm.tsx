'use client'

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
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/Textarea';
import Link from 'next/link';
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const FormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    username: z
        .string()
        .min(1, 'Username is required')
        .min(8, 'Username must have more than 2 characters'),
    bio: z.string().optional(),
});

const EditProfileForm = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            username: '',
            bio: '',
        },
    })

    // TODO : Probably just create a API fetch instead of leaving evertyhing in the JWT coockie
    useEffect(() => {
        if (session?.user) {
            form.reset({
                name: session.user.name || '',
                email: session.user.email || '',
                username: session.user.username || '',
                bio: session.user.bio || '',
            });
        }
    }, [session, form]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
        }
    }, [status, router]);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

            const updated = await res.json();
            console.log("Updated user:", updated);

            await getSession();

            router.push('/');
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                <div className='space-y-2'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='John Pork' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='new-email@example.com' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        placeholder='New Username'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='bio'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='New Bio'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className='w-full mt-6' type='submit'>
                    Edit Profile
                </Button>
            </form>
            <Link className='text-blue-500 hover:underline' href='/'>
                Back to Home
            </Link>
        </Form>
    )
}

export default EditProfileForm;