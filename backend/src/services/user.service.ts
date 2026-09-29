import bcrypt from "bcryptjs";
import { Users, type IUser } from "../models/user.ts";
import { generateAccessToken, generateRefreshAccessToken, isTokenRevoked, revokedToken, verifyToken } from "./token.service.ts";
import { AuthenticationError, ValidationError } from "../utils/errors.ts";

interface CreateUserInput{
    name: string,
    email: string,
    password:string,
}

interface AuthResult{
    user: IUser,
    accessToken:string,
    refreshToken:string,
}

interface LoginInput{
    email: string,
    password: string
}

// register users

export async function createUsers(input:CreateUserInput):Promise<AuthResult>{
    
    const { name, email, password } = input;

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
        name,
        email,
        password: hashPassword,
    });

    const accessToken = await generateAccessToken(
        {
            _id:user._id.toString(),
            email:user.email,
            role:user.role,
        }
    );
    const refreshToken = await generateRefreshAccessToken({
            _id:user._id.toString(),
            email:user.email,
            role:user.role});

    return {user, accessToken , refreshToken}
}


export async function loginUser(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;
    const user = await Users.findOne({ email });

    if (!user) {
        throw new ValidationError("invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ValidationError("The password does not match");
    }

    const accessToken = await generateAccessToken({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const refreshToken = await generateRefreshAccessToken({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    return { user, accessToken, refreshToken };
}

export async function logoutUser(refreshToken:string| undefined):Promise<void> {
    if (!refreshToken) {
        throw new AuthenticationError("No Active session found");
    }

    const { jti, exp } = await verifyToken(refreshToken);

    if (!jti) {
        throw new AuthenticationError("invalid session token");
    }

    const expiresAt = new Date(exp * 1000);

    await revokedToken(jti, expiresAt);
}

export async function getUserById(id:string):Promise<IUser | null> {
    const user = await Users.findById(id);
    return user;
}


export async function refreshAccessToken(refreshToken:string | undefined):Promise<string> {
    
    if (!refreshToken) {
    throw new AuthenticationError('No active session found');
  }

    const { id, email,role, jti } = await verifyToken(refreshToken);

     if (!jti) {
    throw new AuthenticationError('Invalid session token');
    }
    
    const revoked = await isTokenRevoked(jti);
    if (revoked) {
        throw new AuthenticationError('Session has been revoked');
    }

    const newAccessToken = await generateAccessToken({ _id: id, email, role });

    return newAccessToken;

}