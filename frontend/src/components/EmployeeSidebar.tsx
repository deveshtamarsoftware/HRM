import {
  Home,
  FileText,
  Briefcase,
  Calendar,
  User,
  Bell,
} from "lucide-react";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";

export const EmployeeSidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
  { label: "Dashboard", icon: Home, path: "/employee" },
  { label: "My Profile", icon: User, path: "/employee/profile" },
  { label: "My Projects", icon: Briefcase, path: "/employee/projects" },
  { label: "My Timesheets", icon: FileText, path: "/employee/timesheets" },
  { label: "My Attendance", icon: Calendar, path: "/employee/attendance" },
  { label: "My Leaves", icon: Calendar, path: "/employee/leaves" },
  { label: "Announcements", icon: Bell, path: "/employee/announcements" },
];


  return (
    <aside className="fixed bg-gradient-to-b from-[#0B1B3B] to-[#13294B] text-white w-64 min-h-screen flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 flex justify-center border-b border-white/10">
        <img src={logo} alt="Logo" className="h-10" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
