"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page) });
    if (filter) q.set("outcome", filter);
    const res = await fetch(`/api/submissions?${q}`);
    const data = await res.json();
    setSubmissions(data.submissions || []);
    setPages(data.pages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, [page, filter]);

  const outcomeColor = (o: string) =>
    o === "approved" ? "bg-green-900 text-green-300" :
    o === "blocked" ? "bg-red-900 text-red-300" :
    "bg-yellow-900 text-yellow-300";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Submissions</h1>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : submissions.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg">No submissions yet.</p>
            <Link href="/submit" className="text-blue-400 hover:underline mt-2 inline-block">Submit your first image</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s._id} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{new Date(s.createdAt).toLocaleString()}</p>
                  <p className="text-sm mt-1">{s.verdict.categoryResults.length} categories scanned</p>
                  {s.appealId && <p className="text-xs text-blue-400 mt-1">Appeal filed</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${outcomeColor(s.verdict.outcome)}`}>
                    {s.verdict.outcome}
                  </span>
                  <Link href={`/dashboard/${s._id}`} className="text-blue-400 text-sm hover:underline">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex gap-2 mt-6">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600" : "bg-gray-800"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}