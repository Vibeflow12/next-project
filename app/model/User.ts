import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        rquired: true,
        default: Date.now
    }
})


// user model

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema = new Schema<User>({
    name: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        rquired: [true, "Username is required"],
        unique: true,
        match: [/.+\@.+\..+/, "pleasse use a valid email address"]
    },
    password: {
        type: String,
        rquired: [true, "password is required"],
        min: 4,
        max: 8
    },
    verifyCode: {
        type: String,
        rquired: [true, "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        rquired: [true, "verify code expiry  is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;