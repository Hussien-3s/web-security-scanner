import mongoose, { Document, Schema } from "mongoose";

export interface ITarget extends Document {
    target: string;
    description?: string;
    user: mongoose.Types.ObjectId;
}

const targetSchema = new Schema<ITarget>({
    target: { type: String, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Target = mongoose.model<ITarget>('Target', targetSchema);
