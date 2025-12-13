import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logo-1.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  // Role badge styling
  const getRoleBadgeClass = (role) => {
    const roleMap = {
      admin: "role-badge-admin",
      manager: "role-badge-manager",
      technician: "role-badge-technician",
      service_advisor: "role-badge-service-advisor",
      cashier: "role-badge-cashier",
    };
    return roleMap[role] || "role-badge-service-advisor";
  };

  const getRoleDisplay = (role) => {
    return role?.replace("_", " ").toUpperCase() || "USER";
  };

  if (!user) return null;

  return (
    <nav className="glass-card sticky top-0 z-50 mb-6 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={logo} alt="AutoServe" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                AutoServe
              </h1>
              <p className="text-xs text-slate-500">Smart Service Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname === "/dashboard"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/jobcards"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname.includes("/jobcards")
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              Job Cards
            </Link>
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname === "/profile"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              Profile
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-700">
                {user.name || user.email}
              </p>
              <span className={`text-xs ${getRoleBadgeClass(user.role)}`}>
                {getRoleDisplay(user.role)}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-rose-600 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-2">
          <Link
            to="/dashboard"
            className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/dashboard"
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            Dashboard
          </Link>
          <Link
            to="/jobcards"
            className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname.includes("/jobcards")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            Job Cards
          </Link>
          <Link
            to="/profile"
            className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/profile"
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}