"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<any>(null);
  const [appeal, setAppeal] = useState("");
  const [appealMsg, setAppealMsg] = useState("");
  const [filing, setFiling] = useState(false);

  useEffect(() => {
    fetch(`/api/submissions/${id}`).then(r => r.json()).then(d => setSubmission(d.submission));
  }, [id]);

  const fileAppeal = async () => {
    setFiling(true);
    const res = await fetch("/api/appeals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: id, justification: appeal }),
    });
    const data = await res.json();
    if (res.ok) { setAppealMsg("Appeal filed successfully!"); setSubmission((s: any) => ({ ...s, appealId: data.appeal._id })); }
    else setAppealMsg(data.error);
    setFiling(false);
  };

  if (!submission) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p>Loading...</p></div>;

  const canAppeal = ["flagged", "blocked"].includes(submission.verdict.outcome) && !submission.appealId;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Submission Detail</h1>
        <p className="text-gray-400 text-sm mb-6">{new Date(submission.createdAt).toLocaleString()}</p>

        {submission.imageBase64 && (
          <img src={submission.imageBase64} alt="Submitted" className="rounded-xl max-h-64 mb-6 object-contain" />
        )}

        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <p className="font-bold text-lg mb-1">
            Verdict: <span className={
              submission.verdict.outcome === "approved" ? "text-green-400" :
              submission.verdict.outcome === "blocked" ? "text-red-400" : "text-yellow-400"
            }>{submission.verdict.outcome.toUpperCase()}</span>
          </p>
          <div className="space-y-2 mt-4">
            {submission.verdict.categoryResults.map((r: any, i: number) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{r.label}</span>
                  <span className={r.flagged ? "text-red-400" : "text-green-400"}>
                    {r.confidence}% — {r.flagged ? "Flagged" : "Clear"}
                  </span>
                </div>
                <p className="text-gray-400 mt-1">{r.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {submission.appealId && (
          <div className="bg-blue-950 rounded-xl p-4 text-blue-300 text-sm">
            Appeal has been filed. Check <a href="/appeals" className="underline">My Appeals</a> for status.
          </div>
        )}

        {canAppeal && (
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="font-bold mb-3">File an Appeal</h2>
            <textarea
              value={appeal}
              onChange={(e) => setAppeal(e.target.value)}
              placeholder="Explain why you believe this verdict is incorrect..."
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm h-28 outline-none"
            />
            {appealMsg && <p className="text-sm mt-2 text-blue-400">{appealMsg}</p>}
            <button
              onClick={fileAppeal}
              disabled={filing || !appeal.trim()}
              className="mt-3 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {filing ? "Filing..." : "Submit Appeal"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}