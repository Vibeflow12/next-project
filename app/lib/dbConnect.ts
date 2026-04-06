import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: number
}

const connection: ConnectObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("already connected to db")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '')

        if (!db) {
            throw new Error("MONGODB_URL not found")
        }

        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully")
    } catch (error) {
        console.log("db connection failed", error)
        process.exit(1)
    }
}

export default dbConnect;