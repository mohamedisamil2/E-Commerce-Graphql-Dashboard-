import type { MyContext } from "../../middleware/auth.ts";
import { createNewCategory, getCategoryById } from "../../services/category.service.ts";
import { requireAdmin } from "../../utils/requireAdmin.ts";


export const categoryResolver = {
    Mutation: {
        createCategory: async (_parent: unknown, args: { name: string }, context:MyContext) => {
            const admin = requireAdmin(context.user);
            return await createNewCategory(args.name, admin.id)
        },
    },

    Query: {
        category: async (_: unknown, args: { id: string }) => {
            return await getCategoryById(args.id);
        }
    }
}