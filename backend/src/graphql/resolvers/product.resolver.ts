import type { MyContext } from "../../middleware/auth.ts";
import { createNewProduct, deleteProductById, getProductById, getProducts, getUploadSignature, type CreateProductInput } from "../../services/product.service.ts";
import { requireAdmin } from "../../utils/requireAdmin.ts";



export const productResolver = {
    Mutation: {
        createProduct: async (_: unknown, args:{input: CreateProductInput }, context: MyContext) => {
            requireAdmin(context.user);
            const product = await createNewProduct(args.input)
        
            return product;
        },
        deleteProduct: async (_: unknown, args: { id: string }, context: MyContext) => {
            requireAdmin(context.user);
            await deleteProductById(args.id);
            return true;
        }
    },
    Query: {
        product: async (_:unknown, args:{id:string})=>{
            return await getProductById(args.id);
        },
        products: async (_:unknown, args:{search?:string|null, page?:number, limit?:number}) => {
            // return await getAllProducts();
            return await getProducts(args.search, args.page, args.limit);
        },
      uploadSignature: (_parent: unknown, _args: unknown, context: MyContext) => {
        requireAdmin(context.user)
        return getUploadSignature();
    },  
    },
}