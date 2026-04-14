import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/app/lib/dbConnect'
import UserModel from '@/app/model/User'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true })
        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false, message: "failed to update user status to accept messages"
                }, { status: 401 }
            )
        }

        return NextResponse.json(
            {
                success: true, message: "Messages acceptance status updated successfully", updatedUser
            }, { status: 200 }
        )

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return NextResponse.json(
            {
                success: false, message: "failed to update user status to accept messages"
            }, { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return NextResponse.json(
                {
                    success: false, message: "user not found"
                }, { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true, isAcceptingMessages: foundUser.isAcceptingMessage
            }, { status: 200 }
        )
    } catch (error) {
        console.error("ERROR", error)
        return NextResponse.json(
            {
                success: false, message: "error in getting message accepting status"
            }, { status: 500 }
        )
    }
}