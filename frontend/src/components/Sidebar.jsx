import React from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  if (!user) return null;

  const menuItems = [
    {
      path: "/dashboard",
      icon: "",
      label: "Dashboard",
      roles: ["admin", "manager", "service_advisor", "technician", "cashier"],
    },
    {
      path: "/jobcards",
      icon: "",
      label: "Job Cards",
      roles: ["admin", "manager", "service_advisor", "technician"],
    },
    {
      path: "/jobcards/new",
      icon: "",
      label: "Create Job Card",
      roles: ["admin", "manager", "service_advisor"],
    },
    {
      path: "/profile",
      icon: "",
      label: "My Profile",
      roles: ["admin", "manager", "service_advisor", "technician", "cashier"],
    },
  ];

  // Filter menu items based on user role
  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="hidden lg:block w-64 glass-card p-6 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Navigation
        </h2>

        {visibleItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
            >
              <span
                className={`text-2xl transform group-hover:scale-110 transition-transform duration-200 ${isActive ? "animate-pulse" : ""
                  }`}
              >
                {item.icon}
              </span>
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats (Optional) */}
      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 className="text-xs font-bold text-slate-600 uppercase mb-2">
          Quick Info
        </h3>
        <div className="space-y-1 text-sm">
          <p className="text-slate-700">
            <span className="font-semibold">Role:</span>{" "}
            {user.role?.replace("_", " ")}
          </p>
          <p className="text-slate-700">
            <span className="font-semibold">User:</span>{" "}
            {user.name || user.email}
          </p>
        </div>
      </div>
    </aside>
  );
}