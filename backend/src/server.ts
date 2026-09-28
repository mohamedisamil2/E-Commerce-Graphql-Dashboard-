import "dotenv/config";
import { connectDB } from "./db/mongodb.ts";
import { createApp } from "./app.ts";


const port = process.env["PORT"];


export async function startServer() {
    
    await connectDB();
    const app = await createApp();
    app.listen(port, () => {
        console.log(`server running on port : ${port}`);
    });

}

startServer();