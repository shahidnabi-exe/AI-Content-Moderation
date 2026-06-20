"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function PoliciesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/policies").then(r => r.json()).then(d => setCategories(d.policy?.categories || []));
  }, []);

  const update = (i: number, key: string, value: any) => {
    setCategories((prev) => prev.map((c, idx) => idx === i ? { ...c, [key]: value } : c));
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/policies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories }),
    });
    setMsg(res.ok ? "Policies saved!" : "Failed to save");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Policy Configuration</h1>
        <div className="space-y-4">
          {categories.map((c, i) => (
            <div key={c.name} className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">{c.label}</h2>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={c.enabled}
                    onChange={(e) => update(i, "enabled", e.target.checked)}
                    className="w-4 h-4"
                  />
                  Enabled
                </label>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex-1">
                  <label className="text-gray-400 block mb-1">Confidence Threshold: {c.confidenceThreshold}%</label>
                  <input
                    type="range" min={0} max={100}
                    value={c.confidenceThreshold}
                    onChange={(e) => update(i, "confidenceThreshold", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Enforcement</label>
                  <select
                    value={c.enforcement}
                    onChange={(e) => update(i, "enforcement", e.target.value)}
                    className="bg-gray-800 text-white px-3 py-1 rounded-lg"
                  >
                    <option value="auto_block">Auto Block</option>
                    <option value="flag_for_review">Flag for Review</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        {msg && <p className="text-green-400 mt-4 text-sm">{msg}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Policies"}
        </button>
      </div>
    </div>
  );
}