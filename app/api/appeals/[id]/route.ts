import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Appeal from "@/app/models/Appeal";
import Submission from "@/app/models/Submission";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status, adminResponse } = await req.json();

  if (!["accepted", "rejected"].includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  await connectDB();
  const appeal = await Appeal.findByIdAndUpdate(
    id,
    { status, adminResponse, reviewedBy: session.user.id },
    { new: true }
  );

  if (!appeal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status === "accepted") {
    await Submission.findByIdAndUpdate(appeal.submissionId, {
      "verdict.outcome": "approved",
    });
  }

  return NextResponse.json({ appeal });
}