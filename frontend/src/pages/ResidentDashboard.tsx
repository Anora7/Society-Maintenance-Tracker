import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Wrench, Zap, Sparkles, Shield, HelpCircle, Clock, CheckCircle2, AlertCircle, Megaphone } from "lucide-react";import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { useAuth } from "../lib/auth";
import type { Complaint, Notice } from "../lib/types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Plumbing: <Wrench className="w-5 h-5" />,
  Electrical: <Zap className="w-5 h-5" />,
  Cleanliness: <Sparkles className="w-5 h-5" />,
  Security: <Shield className="w-5 h-5" />,
  Other: <HelpCircle className="w-5 h-5" />,
};

export default function ResidentDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/complaints/")
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
    api
      .get("/notices/")
      .then((res) => setNotices(res.data.filter((n: Notice) => n.is_important)));
  }, []);


  const openCount = complaints.filter((c) => c.status === "Open").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{user?.username ? `, ${user.username}` : ""} 👋
          </h1>
          {user?.flat_number && (
            <p className="text-slate-500 text-sm mt-1">Flat {user.flat_number}</p>
          )}
        </div>

                {notices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-slate-900">Important Notices</h2>
            </div>
            <div className="space-y-2">
              {notices.slice(0, 3).map((n) => (
                <div key={n.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-medium text-slate-900 text-sm">{n.title}</p>
                  <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
              ))}
            </div>
            <Link
              to="/notices"
              className="inline-block text-sm text-teal-600 font-medium hover:underline mt-2"
            >
              View full notice board →
            </Link>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Open" count={openCount} color="from-amber-400 to-orange-500" />
          <StatCard icon={<Clock className="w-5 h-5" />} label="In Progress" count={inProgressCount} color="from-blue-400 to-cyan-500" />
          <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Resolved" count={resolvedCount} color="from-emerald-400 to-teal-500" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">My Complaints</h2>
          <Link
            to="/resident/complaints/new"
            className="flex items-center gap-1.5 gradient-brand text-white text-sm font-medium rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Raise a Complaint
          </Link>
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading...</p>}

        {!loading && complaints.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-slate-400 text-sm">No complaints yet. Raise one if something needs attention.</p>
          </div>
        )}

        <div className="space-y-3">
          {complaints.map((c) => (
            <Link
              key={c.id}
              to={`/resident/complaints/${c.id}`}
              className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-md transition"
            >
              <div className="bg-teal-50 text-teal-600 rounded-xl p-3 flex-shrink-0">
                {CATEGORY_ICONS[c.category] || <HelpCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">{c.category}</span>
                  <div className="flex gap-2">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{c.description}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Raised {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  count,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${color} opacity-10`} />
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{count}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}