const STATUS_STYLES: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

const PRIORITY_STYLES: Record<string, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"}`}>
      {priority}
    </span>
  );
}