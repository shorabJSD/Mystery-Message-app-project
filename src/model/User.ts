import mongoose, { Schema } from "mongoose";
 
export interface Message extends Document{
    content: string;
    createAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
        content:{
            type: String,
            required: true,
        },
        createAt: {
            type: Date,
            required: true,
            default: Date.now,
        }
});



export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerifiedExpiration: Date;
    isVerified: boolean;
    isAcceptionMessage: boolean;
    message: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Please provide user name"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "Please provide email"],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Please provide password"],
        trim: true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"]
    },
    verifyCode:{
        type: String,
        required: true,
    },
    isVerifiedExpiration:{
        type: Date,
        required: true,
    },
    isVerified:{
        type: Boolean,
        required: true,
        default: false,
    },
    isAcceptionMessage:{
        type: Boolean,
        required: true,
        default: true,
    },
    message: [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;