import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Policy from "@/app/models/Policy";
import { seedDefaultPolicy } from "@/app/lib/seedPolicy";

export async function GET() {
  await connectDB();
  await seedDefaultPolicy();
  const policy = await Policy.findOne();
  return NextResponse.json({ policy });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { categories } = await req.json();
  await connectDB();

  const policy = await Policy.findOneAndUpdate(
    {},
    { categories },
    { new: true, upsert: true }
  );

  return NextResponse.json({ policy });
}