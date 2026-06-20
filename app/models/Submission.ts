import mongoose, { Schema, Document } from "mongoose";
import { CategoryName } from "./Policy";

export interface ICategoryResult {
  category: CategoryName;
  label: string;
  flagged: boolean;
  confidence: number;
  reasoning: string;
}

export interface IVerdict {
  outcome: "approved" | "flagged" | "blocked";
  categoryResults: ICategoryResult[];
  policySnapshot: object;
  createdAt: Date;
}

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  imageBase64: string;
  verdict: IVerdict;
  appealId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CategoryResultSchema = new Schema<ICategoryResult>({
  category: String,
  label: String,
  flagged: Boolean,
  confidence: Number,
  reasoning: String,
});

const VerdictSchema = new Schema<IVerdict>({
  outcome: { type: String, enum: ["approved", "flagged", "blocked"] },
  categoryResults: [CategoryResultSchema],
  policySnapshot: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, default: "" },
    imageBase64: { type: String, required: true },
    verdict: { type: VerdictSchema, required: true },
    appealId: { type: Schema.Types.ObjectId, ref: "Appeal" },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);