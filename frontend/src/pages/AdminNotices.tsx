import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import type { Notice } from "../lib/types";

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.get("/notices/").then((res) => setNotices(res.data));
  }

  useEffect(load, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/notices/", { title, body, is_important: isImportant });
      setTitle("");
      setBody("");
      setIsImportant(false);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Post a Notice</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 mb-8">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Notice body..."
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
            />
            Mark as important (pins to top + emails residents)
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            {submitting ? "Posting..." : "Post Notice"}
          </button>
        </form>

        <h2 className="text-sm font-semibold text-slate-900 mb-3">Existing Notices</h2>
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 ${
                n.is_important ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-medium text-slate-900">{n.title}</h3>
              <p className="text-sm text-slate-600">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}