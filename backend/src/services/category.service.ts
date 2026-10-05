import { Categories, type ICategory } from "../models/categoriesModel.ts";
import { NotFoundError, ValidationError } from "../utils/errors.ts";



export async function createNewCategory(name:string ,authorId:string):Promise<ICategory> {

    const existingCategory = await Categories.findOne({ name });

    if (existingCategory) {
        throw new ValidationError("category already exist");
    }

    const category = await Categories.create({
        name,
        author: authorId,
    });
    await category.populate(["author"]);

    return category;
}


export async function getCategoryById(id:string):Promise<ICategory> {
    
    const category = await Categories.findById(id).populate("author");

    if (!category) {
        throw new NotFoundError("category not found");
    }
    return category;
}
