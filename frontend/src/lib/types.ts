export interface StatusHistoryEntry {
  id: number;
  status: string;
  note: string;
  changed_by: string;
  changed_at: string;
}

export interface Complaint {
  id: number;
  resident: string;
  category: string;
  description: string;
  photo: string | null;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
  resolved_at: string | null;
  overdue: boolean;
  history: StatusHistoryEntry[];
}

export interface Notice {
  id: number;
  title: string;
  body: string;
  is_important: boolean;
  posted_by: string;
  created_at: string;
}

export const CATEGORIES = ["Plumbing", "Electrical", "Cleanliness", "Security", "Other"];