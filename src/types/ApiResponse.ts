import { Message } from "@/model/User"



export interface ApiResponse{
    message: string
    success: boolean
    isAcceptingMessage?: boolean
    messages?:Array<Message>
}