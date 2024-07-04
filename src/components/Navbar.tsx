
'use client'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth';
import { Button } from './ui/button';
import Link from 'next/link';
const navbar = () => {
  const {data: session} = useSession();
  const user: User = session?.user as User;
  return (
    <div className='w-full shadow-md h-14 bg-white'>
       <div className="flex w-full h-full items-center justify-between  px-5">
         {
           session ? (
             <>
             <h1 className="text-2xl font-bold text-black">Welcome to Mystery Messsage counter, {user.username}</h1>
             <Button onClick={()=>signOut()}>Logout</Button>
            </>
           ): (
            <Link className='flex' href={'/sign-in'}>Signin</Link>
           )
         }
       </div>
    </div>
  )
}

export default navbar
