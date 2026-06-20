import mongoose, { Schema, Document } from "mongoose";

export type CategoryName =
  | "graphic_violence"
  | "hate_symbols"
  | "self_harm"
  | "extremist_propaganda"
  | "weapons_contraband"
  | "harassment_humiliation";

export interface ICategoryPolicy {
  name: CategoryName;
  label: string;
  enabled: boolean;
  confidenceThreshold: number; // 0-100
  enforcement: "auto_block" | "flag_for_review";
}

export interface IPolicy extends Document {
  categories: ICategoryPolicy[];
  updatedAt: Date;
}

const CategoryPolicySchema = new Schema<ICategoryPolicy>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  confidenceThreshold: { type: Number, default: 70 },
  enforcement: { type: String, enum: ["auto_block", "flag_for_review"], default: "flag_for_review" },
});

const PolicySchema = new Schema<IPolicy>({ categories: [CategoryPolicySchema] }, { timestamps: true });

export default mongoose.models.Policy || mongoose.model<IPolicy>("Policy", PolicySchema);