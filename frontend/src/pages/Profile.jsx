import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "../components/Layout";
import RoleTag from "../components/RoleTag";
import ConfirmModal from "../components/ConfirmModal";
import api from "../lib/api";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({
    id: "",
    email: "",
    role: "",
    name: "",
  });

  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Redirect if token missing
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    setUserData({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name || "",
    });
    setNewName(decoded.name || "");
  }, [token]);

  // Update Name
  async function handleNameUpdate(e) {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      await api.put("/users/profile", { name: newName });
      setMessage({ type: "success", text: "Name updated successfully!" });
    } catch (err) {
      console.error("Update name error:", err);
      setMessage({ type: "error", text: "Failed to update name." });
    } finally {
      setLoading(false);
    }
  }

  // Update Password
  async function handlePasswordUpdate(e) {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      await api.put("/users/profile", { password });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Update password error:", err);
      setMessage({ type: "error", text: "Failed to update password." });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setIsLogoutModalOpen(true);
  }

  function confirmLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold text-gradient mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={message.type === "success" ? "alert-success" : "alert-error"}>
            <p className={message.type === "success" ? "text-emerald-700" : "text-red-700"}>
              {message.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Update Name */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Update Name
              </h2>
              <form onSubmit={handleNameUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || newName === userData.name}
                >
                  {loading ? "Updating..." : "Update Name"}
                </button>
              </form>
            </div>

            {/* Update Password */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Change Password
              </h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-success"
                  disabled={loading || !password || !confirmPassword}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Account Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Name</p>
                  <p className="font-semibold text-slate-800">{userData.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Email</p>
                  <p className="font-semibold text-slate-800 break-all">{userData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Role</p>
                  <RoleTag role={userData.role} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">User ID</p>
                  <p className="font-mono text-xs text-slate-600 break-all">{userData.id}</p>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="font-bold text-slate-800 mb-3">Security Tips</h3>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Use a strong, unique password</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Change your password regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Never share your credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Log out from shared devices</span>
                </li>
              </ul>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="w-full btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Logout?"
        message="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Stay"
        type="warning"
      />
    </Layout>
  );
}