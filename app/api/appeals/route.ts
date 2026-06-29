import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Appeal from "@/app/models/Appeal";
import Submission from "@/app/models/Submission";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { submissionId, justification } = await req.json();
  if (!submissionId || !justification)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();
  const submission = await Submission.findById(submissionId);

  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  if (submission.userId.toString() !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (submission.verdict.outcome === "approved")
    return NextResponse.json({ error: "Cannot appeal approved submissions" }, { status: 400 });
  if (submission.appealId)
    return NextResponse.json({ error: "Appeal already filed" }, { status: 409 });

  const appeal = await Appeal.create({
    submissionId,
    userId: session.user.id,
    justification,
  });

  await Submission.findByIdAndUpdate(submissionId, { appealId: appeal._id });

  return NextResponse.json({ appeal }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const isAdmin = (session.user as any).role === "admin";

  const query = isAdmin ? {} : { userId: session.user.id };
  const appeals = await Appeal.find(query)
    .populate("submissionId")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json({ appeals });
}