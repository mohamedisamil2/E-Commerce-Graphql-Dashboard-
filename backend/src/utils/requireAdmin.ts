import type { AuthUser } from "../middleware/auth.ts";
import { AuthenticationError, ForbiddenError } from "./errors.ts";



export function requireAdmin(user:AuthUser| null):AuthUser {
    
    if (!user) {
        throw new AuthenticationError();
    }

    if (user.role !== "admin") {
        throw new ForbiddenError("only admin can perform this action")
    }

    return user;
}