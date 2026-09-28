import mongoose from "mongoose"

export async function connectDB(): Promise<void> {
    const mongo_uri = process.env["MONGO_URI"];
    if (!mongo_uri) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }
    try {
        const conn = await mongoose.connect(mongo_uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection faild:", error)
        process.exit(1);
    }
    
}