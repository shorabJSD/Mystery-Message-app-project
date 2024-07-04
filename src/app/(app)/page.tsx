'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


import message from "@/message.json"
import autoPlay from "embla-carousel-autoplay"

 const page = () => {
   return (
     <div className='w-full h-screen'>
      <div className='w-full text-center py-4'>
       <h1 className='text-3xl uppercase font-bold'>Dive into the world of Anonymous Conversations</h1>
       <p>Explore Mystery Message - where your identity ramins s secret.</p>
      </div>
      <Carousel
       plugins={[autoPlay({delay:2000})]}
      className="w-full max-w-xs m-auto">
      <CarouselContent>
         {
          message.map((message, index)=>(
            <CarouselItem key={index}>
            <div className="p-1">
              <Card>
              <CardHeader className="w-full text-center">
                 <h1 className="text-xl font-bold">{message.title}</h1>
              </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-xl text-center font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
         }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
     </div>
   )
 }
 
 export default page
 