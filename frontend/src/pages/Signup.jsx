import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import logo from "../assets/logo-1.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("service_advisor");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password, role });
      // Show success and redirect to login
      navigate("/", { state: { message: "Account created! Please sign in." } });
    } catch (error) {
      setErr(error.response?.data?.msg || error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { value: "service_advisor", label: "Service Advisor", icon: "" },
    { value: "technician", label: "Technician", icon: "" },
    { value: "cashier", label: "Cashier", icon: "" },
    { value: "manager", label: "Manager", icon: "" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <img src={logo} alt="AutoServe" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Join AutoServe
          </h1>
          <p className="text-slate-600">Smart Vehicle Service Platform</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Get Started
          </h2>

          {err && (
            <div className="alert-error animate-fade-in">
              <p className="text-red-700 font-medium">{err}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${role === r.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Choose your role in the service center
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-success"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          © 2025 AutoServe. All rights reserved.
        </p>
      </div>
    </div>
  );
}