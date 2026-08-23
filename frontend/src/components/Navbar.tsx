import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { APARTMENT_NAME } from "../lib/config";
import { Building2, ClipboardList, Megaphone, LayoutDashboard, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="gradient-brand shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">{APARTMENT_NAME}</p>
            <p className="text-white/70 text-xs leading-tight">Maintenance Tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {user?.role === "resident" && (
            <>
              <NavLink to="/resident" icon={<ClipboardList className="w-4 h-4" />} label="My Complaints" />
              <NavLink to="/notices" icon={<Megaphone className="w-4 h-4" />} label="Notice Board" />
            </>
          )}
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/complaints" icon={<ClipboardList className="w-4 h-4" />} label="Complaints" />
              <NavLink to="/admin/notices" icon={<Megaphone className="w-4 h-4" />} label="Notices" />
              <NavLink to="/admin/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
            </>
          )}
        </div>

          <NavLink to="/profile" icon={<User className="w-4 h-4" />} label="Profile" />

        <div className="flex items-center gap-3">
          <span className="text-white/90 text-sm font-medium hidden sm:block">{user?.username}</span>
          <button
          onClick={() => {
            logout();
            navigate("/login");
          }}>
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 text-white/85 hover:text-white hover:bg-white/10 text-sm font-medium rounded-lg px-3 py-2 transition"
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}