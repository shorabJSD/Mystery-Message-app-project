import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User";

export default async function POST(request: Request) {
   await dbConnect();
   const {username, content} = await request.json();
   try {
    const user = await UserModel.findOne({username: username});
    if (!user) {
      return Response.json({
         message: "User not found",
         success: false,
         error: true,
     }, {
      status: 404,
    })
   }

   const newMessage = {content, createAt:new Date()}
   user.message.push(newMessage as Message);
   await user.save();

   return Response.json({
      message: "message sent successfully",
      success: true,
      error: false,
  }, {
   status:200,
 })

   } catch (error) {
      console.error("Error adding messages", error)
      return Response.json({
         message: "An unexpected occured",
         success: true,
         error: false,
     }, {
         status: 401
     })
   }
}