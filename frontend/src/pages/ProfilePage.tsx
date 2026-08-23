import { useState } from "react";
import { User, Lock, Save } from "lucide-react";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [flatNumber, setFlatNumber] = useState(user?.flat_number || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await api.patch("/auth/me/", { flat_number: flatNumber });
      setProfileMsg("Profile updated.");
    } catch {
      setProfileMsg("Could not update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMsg("");
    setPasswordError("");
    try {
      await api.post("/auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMsg("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      const data = err?.response?.data;
      setPasswordError(
        data?.old_password?.[0] || data?.new_password?.[0] || "Could not change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        <h1 className="text-xl font-bold text-slate-900">Profile & Settings</h1>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-900">Account Info</h2>
          </div>

          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Username</span>
              <span className="text-slate-900 font-medium">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Role</span>
              <span className="text-slate-900 font-medium capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Flat Number</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
              />
            </div>
            {profileMsg && <p className="text-sm text-teal-600">{profileMsg}</p>}
            <button
              type="submit"
              disabled={profileSaving}
              className="flex items-center gap-1.5 gradient-brand text-white text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-900">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            {passwordMsg && <p className="text-sm text-teal-600">{passwordMsg}</p>}
            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50 transition"
            >
              <Lock className="w-4 h-4" />
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}