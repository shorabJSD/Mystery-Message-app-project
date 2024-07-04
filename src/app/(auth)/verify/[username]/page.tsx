'use client'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { verifyScheamValidation } from '@/schemas/verifyScheam';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifyScheamValidation>>({
        resolver: zodResolver(verifyScheamValidation)
    });
    const onSubmit = async (data: z.infer<typeof verifyScheamValidation>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code,
            })
            console.log("Response revify code", response.data);
            toast({ title: 'Success', description: 'Account verified successfully.' });
            router.replace('sign-in');

        } catch (error) {
            console.log("Error in Signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Sign Up failed",
                description: errorMessage ?? "Sign in failed",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="w-full h-screen bg-slate-200 flex items-center justify-center">
            <div className="w-96 px-3 py-2 m-auto shadow-md bg-white rounded">
                <div className=" -2">
                    <h1 className="text-black text-4xl font-bold text-center">Verify your <br/>account</h1>
                    <p className="text-gray-600">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
