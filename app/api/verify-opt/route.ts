import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    await dbConnect();

    try {
        const { username, code } = await req.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            },
                { status: 404 }
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return NextResponse.json({
                success: true,
                message: "account verify successfully"
            }, { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "verification code has expired , plsease sign up again to get a new code"
            },
                { status: 400 }
            )
        } else {
            return NextResponse.json({
                success: false,
                message: "incorrect verification code"
            },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Error verifying user", error)
        return NextResponse.json({
            success: false,
            message: "Error verifying user"
        },
            { status: 500 }
        )
    }
}
