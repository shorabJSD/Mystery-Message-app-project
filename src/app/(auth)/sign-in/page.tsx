 "use client";
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
 
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import { signInSchemaValidation } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Description } from "@radix-ui/react-toast";

const SignInPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchemaValidation>>({
    resolver: zodResolver(signInSchemaValidation),
    defaultValues: {
      indefier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchemaValidation>) => {
               const result =  await signIn("credentials", {
                  redirect: false,
                  identifir: data.indefier,
                  password: data.password
                 })
                 if(result?.error){
                  toast({
                    title: "Login Failed",
                    description: "Incorrect username and password",
                    variant: "destructive"
                  })
                 }else{
                  toast({
                    title: "Login Successful",
                    description: "You have successfully logged in",
                    variant: "destructive"
                  })
                  router.replace("/dashboard")
                 }
  }

  return (
    <div className="w-full h-screen bg-slate-200 flex items-center justify-center">
      <div className="w-96 px-3 py-2 m-auto shadow-md bg-white rounded">
        <div className="text-center py-2">
          <h1 className="text-black text-4xl font-bold">Join Mystery <br />Message</h1>
          <p className="text-gray-600">Sign In for sending Mystery message</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="indefier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full'>Login</Button>
            <div className="mt-3">
              <p>Dont have an account! <Link href={'/sign-up'}>Sign up</Link></p>
            </div>
          </form>
        </Form>

      </div>
    </div>
  )
}

export default SignInPage
