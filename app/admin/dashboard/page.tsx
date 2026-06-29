"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/app/components/Navbar";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics").then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p>Loading...</p></div>;

  const verdictPie = data.verdictDist.map((v: any) => ({ name: v._id, value: v.count }));
  const appealBar = data.appealStats.map((a: any) => ({ name: a._id, count: a.count }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Total Submissions</p>
            <p className="text-3xl font-bold mt-1">{data.totalSubmissions}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Total Appeals</p>
            <p className="text-3xl font-bold mt-1">{data.appealStats.reduce((s: number, a: any) => s + a.count, 0)}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Appeals Accepted</p>
            <p className="text-3xl font-bold mt-1 text-green-400">
              {data.appealStats.find((a: any) => a._id === "accepted")?.count || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4">Submissions Over Time</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.recentSubmissions}>
                <XAxis dataKey="_id" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none" }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4">Verdict Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={verdictPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {verdictPie.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f2937", border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4">Appeal Outcomes</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={appealBar}>
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="font-semibold mb-4">Top Users by Submissions</h2>
            <div className="space-y-2">
              {data.topUsers.map((u: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{u.name} <span className="text-gray-500">({u.email})</span></span>
                  <span className="font-bold">{u.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}