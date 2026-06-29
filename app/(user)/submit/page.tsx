"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "@/app/components/Navbar";

export default function SubmitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleSubmit = async () => {
    if (!files.length) return;
    setLoading(true);
    setError("");
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    const res = await fetch("/api/submissions", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Submission failed");
    else setResults(data.submissions);
    setLoading(false);
    setFiles([]);
  };

  const outcomeColor = (outcome: string) => {
    if (outcome === "approved") return "text-green-400";
    if (outcome === "blocked") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Images for Moderation</h1>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
            isDragActive ? "border-blue-500 bg-blue-950" : "border-gray-600 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-400">{isDragActive ? "Drop here..." : "Drag & drop images or click to browse"}</p>
        </div>

        {files.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span key={i} className="bg-gray-800 px-3 py-1 rounded text-sm">{f.name}</span>
            ))}
          </div>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !files.length}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Submit for Moderation"}
        </button>

        {results.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold">Results</h2>
            {results.map((s, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-400">Submission {i + 1}</span>
                  <span className={`font-bold uppercase text-sm ${outcomeColor(s.verdict.outcome)}`}>
                    {s.verdict.outcome}
                  </span>
                </div>
                <div className="space-y-2">
                  {s.verdict.categoryResults.map((r: any, j: number) => (
                    <div key={j} className="bg-gray-800 rounded-lg p-3 text-sm">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}