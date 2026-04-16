import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username?: string;
    email: string;
    targets: mongoose.Types.ObjectId[];
    scans: mongoose.Types.ObjectId[];
    profiles: string[];
}

const userSchema = new Schema<IUser>({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    targets: [{ type: Schema.Types.ObjectId, ref: 'Target' }],
    scans: [{ type: Schema.Types.ObjectId, ref: 'ScanResult' }],
    profiles: [{ type: String }],
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);