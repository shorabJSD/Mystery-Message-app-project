import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
 
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/options";
 

export async function DELETE(request: Request, {params}: {params:{messsageid: string}}){
    await dbConnect();
    const messsageId = params.messsageid
    const session = await getServerSession(authOptions);
    const user: User  = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success: false,
            error: true,
            message: "Not Authentecated",
        }, {
            status: 500
        })
    }

  try {
   const updateMessage =  await UserModel.updateOne(
        {_id: user._id},
        {$pull: {message: {_id:messsageId }}}
    )
    if(updateMessage.modifiedCount==0){
        return Response.json({
            success: false,
            error: true,
            message: "Message not found or deleted",
        }, {
            status: 500,
        })
    }
    return Response.json({
        success: true,
        error: false,
        message: "Message is deleted successfully",
    }, {
        status: 200
    })

  } catch (error) {
    console.log("Error is delete message route", error);
    return Response.json({
        success: false,
        error: true,
        message: "Error deleting message",
    }, {
        status: 400
    })
  }
}