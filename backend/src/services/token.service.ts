import { randomUUID } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { RevokedToken } from "../models/revokedTokenModel.ts";


if (!process.env["SECRET_TOKEN"] || !process.env["REFRESH_SECRET_TOKEN"]) {
    throw new Error("jwt secrets are not defined in envirnment variable");
}

const secretAccess = new TextEncoder().encode(process.env["SECRET_TOKEN"]);
const refreshSecretAccess = new TextEncoder().encode(process.env["REFRESH_SECRET_TOKEN"]);

export interface TokenPayload{
    id: string,
    email: string,
    role: "admin" | "user",
    jti?:string
}

export interface TokenUser{
    _id:string,
    email:string,
    role:"admin" | "user",
}

export async function generateAccessToken(user:TokenUser):Promise<string> {
    const token = await new SignJWT({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("15m")
        .sign(secretAccess)
    
    return token;
    
}


export async function generateRefreshAccessToken(user:TokenUser):Promise<string> {
    const token = await new SignJWT({
        id:user._id.toString(),
        email:user.email,
        role:user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setJti(randomUUID())
        .setExpirationTime("30d")
        .sign(refreshSecretAccess)
    return token;   
}

export async function verifyToken(token: string): Promise<TokenPayload & { exp: number }>  {
    const { payload } = await jwtVerify(token, refreshSecretAccess);

    return {
        id: payload?.['id'] as string,
        email: payload?.['email'] as string,
        role: payload?.['role'] as 'admin' | 'user',
        jti: payload?.['jti'] as string,
        exp: payload.exp as number,
    }
}

// for create token blacklist 
export async function revokedToken(jti:string, expiresAt:Date):Promise<void> {
    await RevokedToken.create({ jti, expiresAt });
}

export async function isTokenRevoked(jti:string):Promise<Boolean> {
    const found = await RevokedToken.findOne({ jti });
    return found !== null;
}