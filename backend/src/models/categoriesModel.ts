import mongoose, { model, Schema } from "mongoose"


export interface ICategory{
    name: string
    author:mongoose.Types.ObjectId,
}


const categorySchema = new Schema<ICategory>({

    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required:true,
    },
},
    { timestamps: true },
);

export const Categories = model<ICategory>("Categories", categorySchema);
