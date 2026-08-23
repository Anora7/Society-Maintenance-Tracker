import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "resident" | "admin";
}) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}