 "use client";
 import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { useState } from "react";
 import { useForm } from "react-hook-form"
 import * as z  from "zod"
 
 
 const SignInPage = () => {
  //apply debounceing technique; that means entering username on the input-field instantly check and sent a request befor submit;
  const [username, setUsername] = useState('');
  //check if username is already set and get a message from the server;
  const [usernameMessage, setUsernameMessage] = useState('');
  //loading statement;
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  // submit status; 
  const [isSubmit, setIsSubmit] = useState(false);



   return (
     <div>
        
     </div>
   )
 }
 
 export default SignInPage
 
 
 
 