import{ model, Schema } from "mongoose"


export interface IUser{
    name: string
    email: string
    password: string
    role:"admin"| "user"
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "admin",
    },

},
    { timestamps: true },
);

export const Users = model<IUser>("Users", userSchema);