import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "../components/Layout";
import api from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const user = token ? jwtDecode(token) : null;

  async function fetchDashboardData() {
    try {
      const res = await api.get("/jobcards");
      const jobs = res.data;

      // Calculate stats
      setStats({
        total: jobs.length,
        new: jobs.filter((j) => j.status === "new").length,
        inProgress: jobs.filter((j) => j.status === "in_progress").length,
        completed: jobs.filter((j) => j.status === "done" || j.status === "closed").length,
      });

      // Get 5 most recent jobs
      setRecentJobs(jobs.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: "Total Job Cards",
      value: stats.total,
      icon: "",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "New",
      value: stats.new,
      icon: "",
      gradient: "from-slate-500 to-slate-600",
      bgGradient: "from-slate-50 to-slate-100",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: "",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
    },
  ];

  const quickActions = [
    {
      title: "Create Job Card",
      description: "Add a new service request",
      icon: "",
      link: "/jobcards/new",
      gradient: "from-blue-600 to-indigo-600",
      roles: ["admin", "manager", "service_advisor"],
    },
    {
      title: "View All Jobs",
      description: "Browse all job cards",
      icon: "",
      link: "/jobcards",
      gradient: "from-purple-600 to-violet-600",
      roles: ["admin", "manager", "service_advisor", "technician"],
    },
    {
      title: "My Profile",
      description: "Update your information",
      icon: "",
      link: "/profile",
      gradient: "from-slate-600 to-slate-700",
      roles: ["admin", "manager", "service_advisor", "technician", "cashier"],
    },
  ];

  const visibleActions = quickActions.filter((action) =>
    action.roles.includes(user?.role)
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card p-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome back, {user?.name || user?.email}!
          </h1>
          <p className="text-slate-600">
            Here's what's happening with your service center today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="glass-card p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} mb-4`}>
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                {stat.title}
              </h3>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.link}
                className="glass-card p-6 group hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${action.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{action.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Job Cards */}
        {recentJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Recent Job Cards</h2>
              <Link
                to="/jobcards"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="table-header">
                    <tr>
                      <th className="table-cell font-semibold text-left">Job Number</th>
                      <th className="table-cell font-semibold text-left">Customer</th>
                      <th className="table-cell font-semibold text-left">Vehicle</th>
                      <th className="table-cell font-semibold text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map((job) => (
                      <tr
                        key={job._id}
                        onClick={() => navigate(`/jobcards/${job._id}`)}
                        className="table-row"
                      >
                        <td className="table-cell font-medium text-blue-600">
                          {job.jobNumber}
                        </td>
                        <td className="table-cell">{job.vehicle.ownerName}</td>
                        <td className="table-cell">
                          {job.vehicle.model} ({job.vehicle.regNo})
                        </td>
                        <td className="table-cell">
                          <span className={`badge badge-${job.status.replace("_", "-")}`}>
                            {job.status.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}