import mongoose, { Schema, Document } from "mongoose";

export interface IAppeal extends Document {
  submissionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  justification: string;
  status: "pending" | "accepted" | "rejected";
  adminResponse?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppealSchema = new Schema<IAppeal>(
  {
    submissionId: { type: Schema.Types.ObjectId, ref: "Submission", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    justification: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    adminResponse: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Appeal || mongoose.model<IAppeal>("Appeal", AppealSchema);