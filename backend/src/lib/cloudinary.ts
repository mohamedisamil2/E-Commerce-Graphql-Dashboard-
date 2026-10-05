import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const cloudName = process.env["CLOUD_NAME"];
const apiKey = process.env["CLOUD_API_KEY"];
const apiSecret = process.env["CLOUD_API_SECRET"];

if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});


console.log("env:", {
  name: process.env["CLOUD_NAME"],
  key: !!process.env["CLOUD_API_KEY"],
  secret: !!process.env["CLOUD_API_SECRET"],
});
console.log("config:", { cloud_name: cloudinary.config()["cloud_name"] });

export default cloudinary;

