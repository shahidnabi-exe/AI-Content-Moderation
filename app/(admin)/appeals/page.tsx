"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/appeals").then(r => r.json()).then(d => setAppeals(d.appeals || []));
  }, []);

  const review = async (id: string, status: "accepted" | "rejected") => {
    const res = await fetch(`/api/appeals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminResponse: responses[id] || "" }),
    });
    if (res.ok) {
      setAppeals((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
    }
  };

  const pending = appeals.filter((a) => a.status === "pending");
  const reviewed = appeals.filter((a) => a.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Appeals Queue</h1>

        <h2 className="text-lg font-semibold mb-3 text-yellow-400">Pending ({pending.length})</h2>
        {pending.length === 0 ? <p className="text-gray-400 mb-8">No pending appeals.</p> : (
          <div className="space-y-4 mb-10">
            {pending.map((a) => (
              <div key={a._id} className="bg-gray-900 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">{new Date(a.createdAt).toLocaleString()}</p>
                <p className="text-sm"><span className="text-gray-400">User: </span>{a.userId?.name} ({a.userId?.email})</p>
                <p className="text-sm mt-1"><span className="text-gray-400">Justification: </span>{a.justification}</p>
                <textarea
                  placeholder="Optional response to user..."
                  value={responses[a._id] || ""}
                  onChange={(e) => setResponses((r) => ({ ...r, [a._id]: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm h-20 outline-none mt-3"
                />
                <div className="flex gap-3 mt-3">
                  <button onClick={() => review(a._id, "accepted")} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm">Accept</button>
                  <button onClick={() => review(a._id, "rejected")} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3 text-gray-400">Reviewed ({reviewed.length})</h2>
        <div className="space-y-3">
          {reviewed.map((a) => (
            <div key={a._id} className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">{a.userId?.name}</p>
                <p className="text-sm">{a.justification.slice(0, 80)}...</p>
              </div>
              <span className={`text-sm font-bold uppercase ${a.status === "accepted" ? "text-green-400" : "text-red-400"}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}