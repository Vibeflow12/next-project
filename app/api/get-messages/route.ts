import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/app/lib/dbConnect'
import UserModel from '@/app/model/User'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        const user = await UserModel.aggregate([
            {
                $match: { id: userId }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: { 'messages.createdAt': -1 }
            }, {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }
        ])

        if (!user || user.length === 0) {
            return NextResponse.json(
                {
                    success: false, message: "user not found",
                }, { status: 401 }
            )
        }

        return NextResponse.json(
            {
                success: true, message: user[0].messages,
            }, { status: 200 }
        )

    } catch (error) {
        console.error("an unexpected error occured: ", error)
        return NextResponse.json(
            {
                success: false, message: "failed to get all the messages for the user"
            }, { status: 500 }
        )
    }
}