"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { signUpSchemaValidation } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";


const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const  debounced  = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchemaValidation>>({
    resolver: zodResolver(signUpSchemaValidation),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          if (response.data.isUnique) {
            setUsernameMessage(response.data.message);
            console.log(response.data.message)
            console.log("Username find through the axios get method in//signIn page", response.data)
          } else {
            setUsernameMessage(response.data.error)
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchemaValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);

    } catch (error) {
      console.log("Error in Signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Sign Up failed",
        description: errorMessage ?? "Sign Up failed",
        variant: "destructive"
      });
    }finally{
      setIsSubmitting(false);

    }
  }

  return (
    <div className="w-full h-screen bg-slate-200 flex items-center justify-center">
      <div className="w-96 px-3 py-2 m-auto shadow-md bg-white rounded">
        <div className="text-center py-2">
           <h1 className="text-black text-4xl font-bold">Join Mystery <br/>Message</h1>
           <p className="text-gray-600">Create an account to start sharing mystery messages with others.</p>
        </div>
        <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
          
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username"
                  className=""
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced (e.target.value);
                    }}
                  />
                </FormControl>
                {
                  isCheckingUsername && <Loader2 className="animate-spin"/>
                }
                <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-600"}`}>{usernameMessage} </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-5 mx-auto flex justify-center w-full">
            {isSubmitting ? (
              <>
                <Loader className="animate-spin"/> Loading..
              </>
            ) : ("Sign Up")}
          </Button>
          <div className="">
            <p>Already have an account? <Link href={'/sign-in'}> login here </Link> </p>
          </div>
        </form>
      </FormProvider>
      </div>
      
    </div>
  )
}

export default SignInPage;
