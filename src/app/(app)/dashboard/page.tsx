import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { accetpMessageSchemaValidation } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
 
const page = () => {

   const [messages, setMessages] = useState<Message[]>([]);
   const [isloading, setIsLoading] = useState(false);
   const [isSwitchLoading, setIsSwitchLoading] = useState(false);

   const {data: session} = useSession();
   const form = useForm({
    resolver:zodResolver(accetpMessageSchemaValidation),
   });

   const {register, watch, setValue} = form;
   const acceptMessages = watch('acceptMessages')
   

   const handleDeleteMessage = async (messageId: string) =>{
        setMessages(messages.filter((message)=>message._id!==messageId))
   }

   const fetchAcceptMessage = useCallback(async()=>{
        setIsSwitchLoading(true);
        try {
         const response = await axios.get<ApiResponse>('/api/accept-messages')
         setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: axiosError.response?.data?.message || 'Failed to fetch message setting',
             variant: "destructive"
          })
        }finally{
          setIsSwitchLoading(false);
        }
   }, [setValue])
   

   const fetchMessages = useCallback(async (refresh: boolean = false)=>{
         setIsLoading(true);
         setIsSwitchLoading(true);
         try {
           const response = await axios.get<ApiResponse>('/api/get-message')
           setMessages(response.data.messages || []);
           if(refresh){
            toast({
              title:"Refreshed Messages",
              description:"Showing latest project"
            })
           }
         } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: axiosError.response?.data?.message || 'Failed to fetch message setting',
             variant: "destructive"
          })
         }finally{
          setIsLoading(false);
         setIsSwitchLoading(false);
         }
   },[setIsLoading, setMessages]);

    useEffect(()=>{
       if(!session || !session.user) return
       fetchMessages();
       fetchAcceptMessage();
    }, [fetchAcceptMessage, fetchMessages, setValue, session])

    
    const handleSwitchChange = async () =>{
         try {
         const response =  await axios.post<ApiResponse>('/api/accept-messages', {
          acceptMessages: !acceptMessages,
         })
         toast({
             title: response.data.message || 'Failed to switch message setting',
             variant: "default"
         })
         setValue('acceptMessages', !acceptMessages)
         } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: axiosError.response?.data?.message || 'Failed to fetch message setting',
             variant: "destructive"
          })
         }
    }

  const {username} = session?.user  as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClickboard = () =>{
     navigator.clipboard.writeText(profileUrl)
     toast({
       title: 'Profile URL copied',
       description: profileUrl,
     })
  }


    if(!session || !session.user){
      return <div>Please login</div>
    }
  return (
    <div>
         <div>
          <h1>User Dashboard</h1>
          <div className="">
            <h1>Unique Link</h1>
            <div>
              <input type="text" 
               value={profileUrl}
               disabled
               className='input input-bordered w-full p-2 mr-2'
              />
              <Button onClick={copyToClickboard}>Copy</Button>
            </div>
          </div>
         </div>
         <div className="mb-4">
          <switch
           {...register('acceptMessages')}
           aria-checked={acceptMessages} 
           onChange= {handleSwitchChange}
           aria-disabled={isSwitchLoading}
          />
          <span>
            Accept Messages: {acceptMessages ? "On " : "Off"}
          </span>
         </div>
         <Separator/>
         <Button
         className='mt-4'
         variant={'outline'}
         onClick={(e)=>{
          e.preventDefault()
          fetchMessages(true)
         }}
         >
          {
            isloading ? (<Loader2 className='animate-spin'/>) : (<RefreshCcw className='h-4 w-4'/>)
          }
         </Button>
         <div>
          {
            messages.length > 0 ? (
              messages.map((message, index)=>(
                <MessageCard 
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ): (
              <div>No messages found</div>
            )
          }
         </div>
    </div>
  )
}

export default page
