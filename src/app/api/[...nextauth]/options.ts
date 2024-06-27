import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcript from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {

                    //user checking ; existing or not?
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.indentifier.email },
                            { username: credentials.indentifier.username }
                        ]
                    });
                    if (!user) {
                        throw new Error("User not found!");
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified, Please verify your account first!");
                    }

                    //password checking
                    const isPasswordMatch = await bcript.compare(credentials.password, user.password)

                    if (isPasswordMatch) {
                        return user
                    } else {
                        throw new Error("Invalid Credentials");
                    }



                } catch (err: any) {
                    throw new Error("Something went wrong", err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            //modify user token;
            if (user) {
                token._id = user._id?.toString();
                token.isVerfied = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },
        async session({ session, token }) {
            //modify user session;
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.isVerified = token.isVerified;
            }
            return session
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET

}