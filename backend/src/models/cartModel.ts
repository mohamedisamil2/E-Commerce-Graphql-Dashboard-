import { model, Schema, type Document } from "mongoose";
import type mongoose from "mongoose";


export interface ICartItems{
    product: mongoose.Types.ObjectId,
    quantity:number,
}

export interface ICart extends Document{
    user: mongoose.Types.ObjectId,
    items:ICartItems[],
}


const cartItemschema = new Schema<ICartItems>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default:1,
    },
    { _id: false},
});

const cartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true,
    },
    items: {
        type: [cartItemschema],
        default: [],
    },
},
    { timestamps: true },
);

export const Carts= model<ICart>("Carts", cartSchema)