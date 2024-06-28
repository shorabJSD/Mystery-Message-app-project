import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(reqest: Request){
    await dbConnect();
    try {
        const {username, code} = await reqest.json();
             const decodedUsername =  decodeURIComponent(username);
             const user =  await UserModel.findOne({username: decodedUsername });
            if(!user){
                return Response.json({
                    message: "User not found",
                    success: false,
                    error: true,
                }, {
                    status: 500
                })
            }

            const isCodeValid = user.verifyCode === code;
            const isCodeNotExpired = new Date(user.isVerifiedExpiration) > new Date();
            if(isCodeValid && isCodeNotExpired){
                user.isVerified  = true;
                await user.save();
                return Response.json({
                    message: "Account is verified successfully",
                    success: true,
                    error: false,
                }, {
                    status: 200
                })
            }else if(!isCodeNotExpired){
                return Response.json({
                    message: "Verification code has expired please signup agian to get a new code",
                    success: false,
                    error: true,
                }, {
                    status: 400
                })
            }

    } catch (error) {
        console.error("Error verify user", error);
        return Response.json({
            message: "Error verify user",
            success: false,
            error: true,
        }, {
            status: 400
        })
    }
}
