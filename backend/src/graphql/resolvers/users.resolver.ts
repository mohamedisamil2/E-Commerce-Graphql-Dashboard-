import type { MyContext } from "../../middleware/auth.ts";
import { createUsers, getUserById, loginUser, logoutUser, refreshAccessToken } from "../../services/user.service.ts";
import { AuthenticationError } from "../../utils/errors.ts";


export const usersResolvers = {
    Query: {
        user: async (_parent: unknown, args: { id: string }) => {
            return getUserById(args.id);
        },

        me: async (_: unknown, _args:unknown, context: MyContext) => {
        
        if (context.tokenError) {
            throw new AuthenticationError("Token invalid or Expired");
        }

        if (!context.user) {
            return null
        }
         
            return getUserById(context.user.id);
        },
        
    },
    Mutation: {
        registerUser: async (_parent: unknown, args:{input:{name:string,email:string,password:string}}, context:MyContext ) => {
            const { user, accessToken, refreshToken } = await createUsers(args.input);

            context.res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env["NODE_ENV"] === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return {
                user,
                accessToken,
                refreshToken,
            };
        },
        login: async (_parent: unknown, args: { email: string, password: string }, context:MyContext) => {
            const { user, accessToken, refreshToken } = await loginUser(args);

            context.res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env["NODE_ENV"] === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                
            });

            return { user, accessToken };
        },
        
        logout: async (_parent: unknown, _args: unknown, context: MyContext) => {
            await logoutUser(context.req.cookies?.['refreshToken']);
            context.res.clearCookie("refreshToken");
            return true;
        },
        refreshToken: async (_parent: unknown, _args: unknown, context: MyContext) => {
            const accessToken = await refreshAccessToken(context.req.cookies?.['refreshToken']);
            return { accessToken };  // ✅ لف الـ string في object
        },
    },
} 