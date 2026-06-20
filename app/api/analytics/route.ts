import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import Appeal from "@/models/Appeal";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();

  const [totalSubmissions, verdictDist, appealStats, topUsers, recentSubmissions] =
    await Promise.all([
      Submission.countDocuments(),

      Submission.aggregate([
        { $group: { _id: "$verdict.outcome", count: { $sum: 1 } } },
      ]),

      Appeal.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      Submission.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { name: "$user.name", email: "$user.email", count: 1 } },
      ]),

      Submission.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
    ]);

  return NextResponse.json({
    totalSubmissions,
    verdictDist,
    appealStats,
    topUsers,
    recentSubmissions,
  });
}