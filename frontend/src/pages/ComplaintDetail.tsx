import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import type { Complaint } from "../lib/types";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    api.get(`/complaints/${id}/`).then((res) => setComplaint(res.data));
  }, [id]);

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
            </div>
          </div>
          <p className="text-slate-600 text-sm mb-4">{complaint.description}</p>
          {complaint.photo && (
            <img src={complaint.photo} alt="Complaint" className="rounded-lg max-h-64 object-cover mb-4" />
          )}
          <p className="text-xs text-slate-400">
            Raised {new Date(complaint.created_at).toLocaleString()}
          </p>
        </div>

        <h2 className="text-sm font-semibold text-slate-900 mb-3">Status History</h2>
        <div className="space-y-3">
          {complaint.history.map((h) => (
            <div key={h.id} className="bg-white rounded-lg border border-slate-200 p-4 relative">
              <div className="flex items-center justify-between mb-1">
                <StatusBadge status={h.status} />
                <span className="text-xs text-slate-400">
                  {new Date(h.changed_at).toLocaleString()}
                </span>
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