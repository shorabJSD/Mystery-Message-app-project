 import dbConnect from "@/lib/dbConnect";
 import UserModel from "@/model/User";
 import { authOptions } from "../[...nextauth]/options";
 import { User, getServerSession } from "next-auth";


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
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptMessages: acceptMessage},
        {new: true}
    )

    if(!updatedUser){
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

 export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
     if(!session || !user){
        console.log("Not authenticated");
        return Response.json({
            success: false,
            error: true,
            message: "Failed to get user status"
        },{status: 500})
     }

     const userId = user._id;
     const foundUser = await UserModel.findById({userId})
    
     try {

        if(!foundUser){
            console.log("User not found");
            return Response.json({
            success: false,
            error: true,
            message: "User not found"
            }, {status: 500})
        }

        return Response.json({
            success: false,
            error: true,
            isacceptingMessage: foundUser.isAcceptionMessage,
            }, {status: 200})

     } catch (error) {
        console.log("Error user status to accept message", error);
        return Response.json({
            success: false,
            error: true,
            message: "Error Failed to update user status to accept message"
        }, {
            status: 401
        })
     }

 }
 