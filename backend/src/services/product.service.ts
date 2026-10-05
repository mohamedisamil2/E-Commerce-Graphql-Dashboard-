import { isValidObjectId } from "mongoose";
import cloudinary from "../lib/cloudinary.ts";
import { Products, type IProducts } from "../models/productsModel.ts";
import { ValidationError } from "../utils/errors.ts";
import { Categories } from "../models/categoriesModel.ts";



export interface CreateProductInput{
    name:string,
    description:string,
    price:number,
    imagePublicId: string,
    categoryId:string,
    size:string[],
    colors:string[],
    countInStock?:number,
    isFeatured?:boolean,
}


const UPLOAD_FOLDER = "Products";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB




export const getUploadSignature = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER },
    api_secret,
  );

  return { signature, timestamp, folder: UPLOAD_FOLDER, cloudName: cloud_name, apiKey: api_key };
};


export async function createNewProduct(input:CreateProductInput):Promise<IProducts> {
   const { imagePublicId, categoryId, ...rest } = input;

    if (!isValidObjectId(categoryId)) {
        throw new ValidationError("invalid category id")
    }
    
    const categoryExists = await Categories.exists({ _id: categoryId });
    
    if (!categoryExists) {
        throw new ValidationError("Category not found");
    }
    
    if (!imagePublicId.startsWith(`${UPLOAD_FOLDER}/`)) {
        throw new ValidationError("Invalid image");
    }
    
    const imageInUse = await Products.exists({ "image.public_id": imagePublicId });
    
    if (imageInUse) {
        throw new ValidationError("Image is already used by another product");
    }

    let resource;
    try {
        resource = await cloudinary.api.resource(imagePublicId, {
            cloud_name: cloudinary.config()["cloud_name"],
        });

    }  catch (err: any) {
    console.log("cloudinary resource error:", err?.error?.http_code, err?.error?.message); // مؤقت
    if (err?.error?.http_code === 404) {
        throw new ValidationError("Image not found");
    }
    throw err;
    }

    if (resource.bytes > MAX_IMAGE_BYTES) {
        await cloudinary.uploader.destroy(imagePublicId);
        throw new ValidationError("Image must be under 2MB");
    }


    const product = await Products.create({
        ...rest,
        category:categoryId,
        image: {
            url: resource.secure_url,
            public_id: resource.public_id,
        },
    });
    await product.populate("category");
    return product;

}

export async function getProductById(id:string):Promise<IProducts> {
    
    const product = await Products.findById(id);

    if (!product) {
        throw new ValidationError("product not found");
    }

    return product;
}

export async function getAllProducts():Promise<IProducts[]> {
    
    const product = await Products.find().populate("category");
    return product;
}

// Get Products
const MAX_SEARCH_LENGTH = 50;

function escapeRegex(text:string):string {
    return text.replace(/[.*+^?${}()|[\]\\]/g, "\\$&");
}

export async function getProducts(search?:string | null, page=1, limit=10) {
    const query: Record<string, unknown> = {};

    if (search) {
        const term = search.trim().slice(0, MAX_SEARCH_LENGTH);
        if (term) {
            const regex = { $regex: escapeRegex(term), $options: "i" };
            const matchedCategory = await Categories.find({ name: regex, }).select("_id");

            query["$or"] = [
                { name: regex },
                {category:{$in:matchedCategory.map(c => c._id)}},
            ]
        }
    }

    const safePage = Math.max(page, 1);
    const safeLimit =  Math.min(Math.max(limit, 1), 50);

    const [items, totalCount] = await Promise.all([
        Products.find(query)
            .sort({ createdAt: -1 })
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit)
            .populate("category"),
        Products.countDocuments(query)
    ]);

    return {
        items,
        totalCount,
        page: safePage,
        totalPages:Math.ceil(totalCount/safeLimit),
        
     };
}


export async function deleteProductById(id:string):Promise<void> {
    
    await getProductById(id);

    await Products.findByIdAndDelete(id);
}