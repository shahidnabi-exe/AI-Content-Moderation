import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const submission = await Submission.findById(params.id).populate("appealId");

  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = submission.userId.toString() === session.user.id;
  const isAdmin = (session.user as any).role === "admin";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ submission });
}