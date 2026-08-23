import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";

interface DashboardData {
  by_status: { status: string; count: number }[];
  by_category: { category: string; count: number }[];
  overdue_count: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard/").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="text-center text-slate-500 mt-8 text-sm">Loading...</p>
      </div>
    );
  }

  const totalComplaints = data.by_status.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Total Complaints</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{totalComplaints}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Overdue</p>
            <p className="text-2xl font-semibold text-red-600 mt-1">{data.overdue_count}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Resolved</p>
            <p className="text-2xl font-semibold text-green-600 mt-1">
              {data.by_status.find((s) => s.status === "Resolved")?.count || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">By Status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.by_status}>
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">By Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.by_category}>
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}