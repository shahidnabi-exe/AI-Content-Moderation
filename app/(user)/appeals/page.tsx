"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function MyAppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/appeals").then(r => r.json()).then(d => setAppeals(d.appeals || []));
  }, []);

  const statusColor = (s: string) =>
    s === "accepted" ? "text-green-400" : s === "rejected" ? "text-red-400" : "text-yellow-400";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Appeals</h1>
        {appeals.length === 0 ? (
          <p className="text-gray-400">No appeals filed yet.</p>
        ) : (
          <div className="space-y-4">
            {appeals.map((a) => (
              <div key={a._id} className="bg-gray-900 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">{new Date(a.createdAt).toLocaleString()}</span>
                  <span className={`font-bold uppercase text-sm ${statusColor(a.status)}`}>{a.status}</span>
                </div>
                <p className="text-sm mb-1"><span className="text-gray-400">Justification: </span>{a.justification}</p>
                {a.adminResponse && (
                  <p className="text-sm text-blue-300 mt-2"><span className="text-gray-400">Admin response: </span>{a.adminResponse}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
