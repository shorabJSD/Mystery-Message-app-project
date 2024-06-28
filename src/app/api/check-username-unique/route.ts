 

import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";


const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request){
    await dbConnect();
    try {

        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }

        //validation with zos;
       const result =  UsernameQuerySchema.safeParse(queryParams);
       console.log(result)
       if(!result.success){
           const usernameErrors = result.error.format().username?._errors
           || [];
           return Response.json({
            message: usernameErrors?.length > 0 ? usernameErrors.join(", "): "Invalid query parameters",
            success: false
           }, {
            status: 400
           })
       }

      const {username} = result.data;
       // Check if username exists in the database
       const existingVerifiedUser = await UserModel.findOne({username:username, isVerified: true});

       if(existingVerifiedUser){
        return Response.json({
            message: "Username already someone taken",
            success: false,
        }, {
            status: 400
        })
       }
      return Response.json({
            message: "Username is unique",
            success: true,
        }, {
            status: 200
        }) 

    } catch (error) {
        console.error("Query Checking Username", error);
        return Response.json({
            message: "Query checking username failed",
            success: false,
            error: true,
        }, {
            status: 400
        })
    }
}