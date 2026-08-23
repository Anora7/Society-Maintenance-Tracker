import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./lib/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResidentDashboard from "./pages/ResidentDashboard";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import AdminComplaints from "./pages/AdminComplaints";
import AdminComplaintDetail from "./pages/AdminComplaintDetail";
import NoticeBoard from "./pages/NoticeBoard";
import AdminNotices from "./pages/AdminNotices";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/resident"
            element={
              <ProtectedRoute role="resident">
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/complaints/new"
            element={
              <ProtectedRoute role="resident">
                <NewComplaint />
              </ProtectedRoute>
            }
          />

                    <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/resident/complaints/:id"
            element={
              <ProtectedRoute role="resident">
                <ComplaintDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute role="admin">
                <AdminComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminComplaintDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <ProtectedRoute role="admin">
                <AdminNotices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/notices" element={<NoticeBoard />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}