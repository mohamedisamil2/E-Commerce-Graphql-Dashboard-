import { errors, jwtVerify } from "jose";
import type { Request, Response } from "express";

export interface AuthUser{
    id: string,
    email: string,
    role:"admin"| "user"
}

export interface MyContext{
    user: AuthUser | null,
    tokenError?: 'expired' | 'invalid',
    req: Request,
    res: Response,
}

if (!process.env['SECRET_TOKEN']) {
    throw new Error("jwt_access_secret is not defined in Environment variable");
}

const secret = new TextEncoder().encode(process.env["SECRET_TOKEN"]);

export async function createContext({ req, res }: { req: Request, res: Response }): Promise<MyContext>{
    const authHeader = req.headers.authorization || ""; 
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        return { user: null, req, res };
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        return {
            user: {
                id:payload["id"] as string,
                email:payload["email"] as string,
                role:payload["role"] as "admin"|"user",
            },
            req,
            res,
        }
    } catch (error) {
         const tokenError = error instanceof errors.JWTExpired ? "expired" : "invalid";
          console.log("token verify failed:", (error as Error).name); // مؤقت
        return { user: null, tokenError, req, res };
    }
    
    
}