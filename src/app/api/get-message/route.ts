import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User  = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success: false,
            error: true,
            message: "Not Authentecated",
            user: null
        }, {
            status: 500
        })
    }

  const userId =  new mongoose.Types.ObjectId(user._id);
  
  try {
    
const user = await UserModel.aggregate([
    {$match: {_id: userId}},
    {$unwind: '$messages'},
    {$sort: {'messages: message.createAt': -1}},
    {$group: {_id:'_id', message: {$push: 'messages'}}}
])
    
    if(!user || user.length === 0){
        return Response.json({
            success: false,
            error: true,
            message: "No messages found",
            user: null
        }, {
            status: 401
        })
    }

    return Response.json({
        success: true,
        error: false,
        message: "Messages fetched successfully",
        user: user[0]
    }, {
        status: 200
    })

  } catch (error) {
    console.log("An unexpected occured", error)
    return Response.json({
        success: false,
        error: true,
        message: "An unexpected occured",
        user: null
    }, {
        status: 400
    })
  }


}