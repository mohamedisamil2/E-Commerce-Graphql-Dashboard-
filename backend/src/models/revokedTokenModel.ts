import { Document, model, Schema } from "mongoose";



export interface IRevokedToken extends Document{
    jti: string;
    expiresAt: Date;
}

const revokedTokenSchema = new Schema<IRevokedToken>({
    jti: {
        type: String,
        unique: true,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
});

export const RevokedToken = model<IRevokedToken>("RevokedToken", revokedTokenSchema);