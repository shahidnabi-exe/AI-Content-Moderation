import { GoogleGenerativeAI } from "@google/generative-ai";
import { ICategoryPolicy } from "../models/Policy";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface CategoryResult {
  category: string;
  label: string;
  flagged: boolean;
  confidence: number;
  reasoning: string;
}

export async function moderateImage(
  base64Image: string,
  mediaType: string,
  activeCategories: ICategoryPolicy[]
): Promise<CategoryResult[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });  
  const categoryList = activeCategories
    .map((c) => `- ${c.name} (${c.label}): threshold ${c.confidenceThreshold}%`)
    .join("\n");

  const prompt = `You are a content moderation AI. Analyze this image against the following categories:

${categoryList}

Respond ONLY with a JSON array, no markdown, no explanation, no backticks. Use this exact format:
[
  {
    "category": "category_name",
    "label": "Human Readable Label",
    "flagged": true or false,
    "confidence": 0-100,
    "reasoning": "brief one sentence reason"
  }
]

Be accurate and conservative. Only flag content that clearly violates the category.`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mediaType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export function computeVerdict(
  results: CategoryResult[],
  policies: ICategoryPolicy[]
): "approved" | "flagged" | "blocked" {
  let verdict: "approved" | "flagged" | "blocked" = "approved";

  for (const result of results) {
    const policy = policies.find((p) => p.name === result.category);
    if (!policy || !policy.enabled) continue;
    if (result.confidence < policy.confidenceThreshold) continue;
    if (!result.flagged) continue;

    if (policy.enforcement === "auto_block") return "blocked";
    if (policy.enforcement === "flag_for_review") verdict = "flagged";
  }

  return verdict;
}