import { connectDB } from "./db";
import Policy from "../models/Policy";

export async function seedDefaultPolicy() {
  await connectDB();
  const existing = await Policy.findOne();
  if (existing) return;

  await Policy.create({
    categories: [
      { name: "graphic_violence", label: "Graphic Violence", enabled: true, confidenceThreshold: 70, enforcement: "auto_block" },
      { name: "hate_symbols", label: "Hate Symbols", enabled: true, confidenceThreshold: 70, enforcement: "auto_block" },
      { name: "self_harm", label: "Self-Harm", enabled: true, confidenceThreshold: 70, enforcement: "flag_for_review" },
      { name: "extremist_propaganda", label: "Extremist Propaganda", enabled: true, confidenceThreshold: 70, enforcement: "auto_block" },
      { name: "weapons_contraband", label: "Weapons & Contraband", enabled: true, confidenceThreshold: 75, enforcement: "flag_for_review" },
      { name: "harassment_humiliation", label: "Harassment & Humiliation", enabled: true, confidenceThreshold: 65, enforcement: "flag_for_review" },
    ],
  });
}