import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";

import { Message } from '@/app/model/User'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    const { username, content } = await req.json()

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, { status: 404 }
            )
        }

        //is user accepting messages
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "user is not accepting messages"
            }, { status: 403 })
        }

        const newMessage = { content, CreatedAt: new Date() }

        user.messages.push(newMessage as unknown as Message)
        await user.save()
        return NextResponse.json({
            success: true,
            message: "messages sent succefully"
        }, { status: 200 })

    } catch (error) {
        console.error("Error adding messages:", error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}