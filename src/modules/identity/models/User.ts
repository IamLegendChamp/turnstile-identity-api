import mongoose, { Schema, Document } from "mongoose";

export type UserType = "general" | "admin" | "superadmin";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    userType: UserType;
    roles: string[];
    refreshTokenHash: string | null;
}

const userSchema = new Schema<IUser> (
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        userType: { 
            type: String,
            enum: ["general", "admin", "superadmin"],
            default: "general"
        },
        roles: { type: [String], default: [] },
        refreshTokenHash: { type: String, default: null }
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
