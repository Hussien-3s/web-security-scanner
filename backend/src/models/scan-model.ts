import mongoose, { Document, Schema } from "mongoose";

export interface IScanResult extends Document {
    target: string;
    profileName: string;
    scanGroupId: string;
    scanResult: Record<string, any>;
    status: "pending" | "completed" | "failed";
    user: mongoose.Types.ObjectId;
}

const scanResultSchema = new Schema<IScanResult>({
    target: { type: String, required: true },
    profileName: { type: String, required: true },
    scanGroupId: { type: String, required: true },
    scanResult: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const ScanResult = mongoose.model<IScanResult>('ScanResult', scanResultSchema);
