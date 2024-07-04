









import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcriptjs from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVeryficationEmail";

export async function POST(request: Request){
    await dbConnect();
    try {
       const {username, email, password} =  await request.json();

       const existingUserByUsername = await UserModel.findOne({username: username});
       const existingUserEmail = await UserModel.findOne({email: email});

       if (existingUserByUsername) {
          return Response.json({
              status: 400,
              success: false,
              message: "Username already exists",
          })
       }

       
       const verifyCode = Math.floor(100000 * Math.random() * 900000).toString();
       
       if(existingUserEmail){
          if(existingUserEmail.isVerified){
             return Response.json({
                 status: 400,
                 success: false,
                 message: "Email already exists",
             })
            
          }else{
             const hashedPassword = await bcriptjs.hash(password, 10);
             existingUserEmail.password =  hashedPassword;
             existingUserEmail.verifyCode = verifyCode;
             existingUserEmail.isVerifiedExpiration = new Date(Date.now() * 360000);
              await existingUserEmail.save();
          }
       }else{

        const expireyDate = new Date();
        expireyDate.setHours(expireyDate.getHours() + 1);
        const hashedPassword = await bcriptjs.hash(password, 10);

        const newUser = new UserModel({
         username,
         email,
         password: hashedPassword,
         verifyCode,
         isVerifiedExpiration: verifyCode,
         isVerified:false,
         isAcceptionMessage: true,
         message:[]
        })

        await newUser.save();
        
    }

    

    //email verification;
   const emailResponse =  await sendVerificationEmail(
        email,
        username,
        verifyCode,
    )

    if(!emailResponse.success){
        return Response.json({
            status: 500,
            success: false,
            message:emailResponse.message,
        })
    }

    return Response.json({
        status: 201,
        success: true,
        message:"User registration verification successfull, Please verify your email address",
    })


    } catch (error) {
        console.error("Error, registration failed", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}












