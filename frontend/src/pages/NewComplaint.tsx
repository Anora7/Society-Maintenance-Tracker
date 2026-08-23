import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { CATEGORIES } from "../lib/types";

export default function NewComplaint() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    if (photo) formData.append("photo", photo);

    try {
      await api.post("/complaints/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/resident");
    } catch (err) {
      setError("Could not submit complaint. Check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Raise a Complaint</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-600"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition"
          >
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}