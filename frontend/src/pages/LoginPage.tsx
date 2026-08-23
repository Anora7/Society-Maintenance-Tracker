import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login} = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
  const loggedInUser = await login(username, password);
  navigate(loggedInUser.role === "admin" ? "/admin/complaints" : "/resident");
} catch (err) {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-slate-500 text-sm mb-6">Sign in to Society Maintenance Tracker</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          No account?{" "}
          <Link to="/register" className="text-teal-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}