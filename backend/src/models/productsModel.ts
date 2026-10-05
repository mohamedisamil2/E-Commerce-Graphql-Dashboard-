import mongoose, { model } from "mongoose";
import { Schema, Types } from "mongoose";


export interface IProducts{
    name: string,
    description: string,
    image: {
        url: string,
        public_id:string,
    },
    category:mongoose.Types.ObjectId,
    size: string[],
    colors: string[],
    price:number,
    countInStock: number,
    isFeatured: boolean,   
}

const productSchema = new Schema<IProducts>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    price: {
        type: Number,
        required:true,  
    },
    size: {
        type: [String],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true,
    },
    isFeatured: {
        type: Boolean,
        required: false,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
},
    { timestamps: true },
);

export const Products=  model<IProducts>("Products", productSchema)