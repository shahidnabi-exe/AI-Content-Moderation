import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import Policy from "@/models/Policy";
import { moderateImage, computeVerdict } from "@/lib/ai";
import { seedDefaultPolicy } from "@/lib/seedPolicy";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await seedDefaultPolicy();

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length)
      return NextResponse.json({ error: "No images provided" }, { status: 400 });

    const policy = await Policy.findOne();
    const activeCategories = policy!.categories.filter((c: any) => c.enabled);

    const results = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mediaType = file.type;

        const categoryResults = await moderateImage(base64, mediaType, activeCategories);
        const outcome = computeVerdict(categoryResults, activeCategories);

        const submission = await Submission.create({
          userId: session.user.id,
          imageBase64: `data:${mediaType};base64,${base64}`,
          verdict: {
            outcome,
            categoryResults,
            policySnapshot: policy!.toObject(),
          },
        });

        return submission;
      })
    );

    return NextResponse.json({ submissions: results }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const outcome = searchParams.get("outcome");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  const query: any = { userId: session.user.id };
  if (outcome) query["verdict.outcome"] = outcome;

  const [submissions, total] = await Promise.all([
    Submission.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Submission.countDocuments(query),
  ]);

  return NextResponse.json({ submissions, total, page, pages: Math.ceil(total / limit) });
}