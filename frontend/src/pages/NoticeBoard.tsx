import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import type { Notice } from "../lib/types";

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    api.get("/notices/").then((res) => setNotices(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Notice Board</h1>
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 ${
                n.is_important ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-medium text-slate-900">{n.title}</h2>
                {n.is_important && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500 text-white">
                    Pinned
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">{n.body}</p>
              <p className="text-xs text-slate-400 mt-2">
                {n.posted_by} · {new Date(n.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}