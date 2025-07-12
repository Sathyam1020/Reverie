'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { authClient } from "@/lib/auth-client";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {FaGithub, FaGoogle} from 'react-icons/fa';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" })
});

const SignInView = () => {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setLoading(true);
        authClient.signIn.email({
            email: data.email,
            password: data.password
        }, {
            onSuccess: () => {
                setLoading(false);
                router.push("/");
            },
            onError: ({ error }) => {
                setError(error.message);
            }
        })
    }

    const onSubmitSocial = (provider: "github" | "google") => {
        setError(null);
        setLoading(true);
        authClient.signIn.social({
            provider: provider,
            callbackURL: '/'
        }, {
            onSuccess: () => {
                setLoading(false);
            },
            onError: ({ error }) => {
                setError(error.message);
            } 
        })
    }

    return (
        <div className='flex flex-col gap-6 '>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome back
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="s@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {
                                    !!error && (
                                        <Alert className="bg-destructive/10 border-none">
                                            <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )
                                }
                                <Button
                                    type="submit"
                                    className="w-full bg-[#0EA5E9] hover:bg-[#0891B2] transition-all duration-200 cursor-pointer"
                                    disabled={loading}
                                >
                                    Sign in
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:-z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                        disabled={loading}
                                        onClick={() => onSubmitSocial("google")}
                                    >
                                        <FaGoogle />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                        disabled={loading}
                                        onClick={() => onSubmitSocial("github")}
                                    >
                                        <FaGithub />
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href='/sign-up'
                                        className="underline underline-offset-4 "
                                    >
                                        Sign-up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-gradient-to-br from-blue-600 via-blue-800 to-blue-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <p className='text-2xl font-semibold text-white flex flex-col items-center'>
                            <img src='/icons/mainLogo2.svg' alt='image' className='h-[92px] w-[92px]' />
                            Reverie
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>
        </div>
    )
}

export default SignInView; 
