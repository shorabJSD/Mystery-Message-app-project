 import dbConnect from "@/lib/dbConnect";
 import UserModel from "@/model/User";
import { authOptions } from "../[...nextauth]/options";
 import { getServerSession } from "next-auth";
 


 export async function POST(reqest: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user  = session?.user
    if(!session || !user){
        return Response.json({
            success: false,
            error: true,
            message: "Not Authentecated",
            user: null
        }, {
            status: 500
        })
    }

  const userId =   user._id
  const {acceptMessage} = await reqest.json();
  try {
    const userUpdate = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptMessages: acceptMessage},
        {new: true}
    )


    if(!userUpdate){
        console.log("failed to authenticate");
        return Response.json({
            success: true,
            message: "Faile to update user status to accept message ", 
            error: true,
            status: 401
        })
    }

    return Response.json({
        success: true,
        message: "User status updated successfully", 
        error: true,
        status: 401
    })

  } catch (error) {
    return Response.json({
        success: false,
        error: true,
        message: "Faile to update user status to accept message.",
        user: null
    }, {
        status: 500
    })

  }

 }
 