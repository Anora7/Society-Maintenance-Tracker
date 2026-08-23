import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import type { Complaint } from "../lib/types";

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    api.get(`/complaints/${id}/`).then((res) => {
      setComplaint(res.data);
      setStatus(res.data.status);
      setPriority(res.data.priority);
    });
  }

  useEffect(load, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/complaints/${id}/status/`, { status, priority, note });
      setNote("");
      load();
    } finally {
      setSaving(false);
    }
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="text-center text-slate-500 mt-8 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-slate-900">{complaint.category}</h1>
            <div className="flex gap-2">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
              {complaint.overdue && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Overdue
                </span>
              )}
            </div>
          </div>
          <p className="text-slate-600 text-sm mb-2">{complaint.description}</p>
          <p className="text-xs text-slate-400">Raised by {complaint.resident}</p>
          {complaint.photo && (
            <img src={complaint.photo} alt="Complaint" className="rounded-lg max-h-64 object-cover mt-4" />
          )}
        </div>

        <form onSubmit={handleUpdate} className="bg-white rounded-xl border border-slate-200 p-6 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Update Status</h2>
          <div className="flex gap-3">
            <select
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Optional note..."
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            {saving ? "Saving..." : "Save Update"}
          </button>
        </form>

        <h2 className="text-sm font-semibold text-slate-900 mb-3">Status History</h2>
        <div className="space-y-3">
          {complaint.history.map((h) => (
            <div key={h.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-1">
                <StatusBadge status={h.status} />
                <span className="text-xs text-slate-400">{new Date(h.changed_at).toLocaleString()}</span>
              </div>
              {h.note && <p className="text-sm text-slate-600 mt-1">{h.note}</p>}
              <p className="text-xs text-slate-400 mt-1">by {h.changed_by}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}