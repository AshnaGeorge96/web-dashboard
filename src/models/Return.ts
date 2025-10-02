import mongoose, { Schema, Document } from "mongoose";

export interface IReturn extends Document {
  orderId: string;
  customerName: string;
  returnDate: Date;
  palletCount: number;
  status: "Pending" | "Completed" | "Rejected";
  remarks?: string;
}

const ReturnSchema = new Schema<IReturn>({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  returnDate: { type: Date, required: true },
  palletCount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Rejected"], default: "Pending" },
  remarks: { type: String },
});

const Return = mongoose.models.Return || mongoose.model<IReturn>("Return", ReturnSchema);

export default Return;
