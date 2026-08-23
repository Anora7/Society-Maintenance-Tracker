import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import type { Complaint } from "../lib/types";
import { CATEGORIES } from "../lib/types";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", status: "", date_from: "", date_to: "" });

  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setLoading(true);
    api
      .get("/complaints/", { params })
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">All Complaints</h1>

        <div className="flex flex-wrap gap-3 mb-6 bg-white rounded-xl border border-slate-200 p-4">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          />
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          />
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading...</p>}

        <div className="space-y-3">
          {complaints.map((c) => (
            <Link
              key={c.id}
              to={`/admin/complaints/${c.id}`}
              className={`block bg-white rounded-xl border p-4 hover:border-teal-300 transition ${
                c.overdue ? "border-red-300 bg-red-50" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{c.category}</span>
                  {c.overdue && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-600 text-white">
                      Overdue
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{c.description}</p>
              <p className="text-xs text-slate-400 mt-2">
                {c.resident} · {new Date(c.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}