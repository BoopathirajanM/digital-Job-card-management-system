import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "../components/Layout";
import api from "../lib/api";

export default function JobCardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [status, setStatus] = useState("");
  const [technician, setTechnician] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchDetails();
  }, []);

  async function fetchDetails() {
    try {
      const res = await api.get(`/jobcards/${id}`);
      setJob(res.data);
      setStatus(res.data.status);
      setTechnician(res.data.assignedTo?._id || "");
      setNotes("");
    } catch (error) {
      setErr("Unable to fetch job card details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    setUpdating(true);
    try {
      const payload = {
        status,
        assignedTo: technician || null,
        notes,
      };

      await api.put(`/jobcards/${id}`, payload);

      // Show success message
      alert("Job card updated successfully!");

      // Refresh data
      fetchDetails();
    } catch (error) {
      alert("Update failed: " + (error.response?.data?.msg || error.message));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job card? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/jobcards/${id}`);
      alert("Job card deleted successfully");
      navigate("/jobcards");
    } catch (error) {
      alert("Unable to delete: " + (error.response?.data?.msg || error.message));
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="alert-error">
          <p className="text-red-700 font-medium">{err || "Job card not found"}</p>
        </div>
      </Layout>
    );
  }

  const canEdit = ["manager", "technician", "admin"].includes(user?.role);
  const canDelete = ["manager", "admin"].includes(user?.role);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <button
            onClick={() => navigate("/jobcards")}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline mb-4"
          >
            ← Back to Job Cards
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Job Card #{job.jobNumber}
              </h1>
              <p className="text-slate-600">
                Created on {new Date(job.createdAt).toLocaleDateString()} at{" "}
                {new Date(job.createdAt).toLocaleTimeString()}
              </p>
            </div>

            <span className={`badge badge-${job.status.replace("_", "-")} text-lg px-4 py-2`}>
              {job.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Information */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Vehicle Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Registration Number</p>
                  <p className="font-bold text-lg text-slate-800">{job.vehicle.regNo}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Model</p>
                  <p className="font-bold text-lg text-slate-800">{job.vehicle.model}</p>
                </div>
                {job.vehicle.kmReading && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">KM Reading</p>
                    <p className="font-bold text-lg text-slate-800">
                      {job.vehicle.kmReading.toLocaleString()} km
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Customer Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Owner Name</p>
                  <p className="font-bold text-lg text-slate-800">{job.vehicle.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Contact Number</p>
                  <p className="font-bold text-lg text-slate-800">{job.vehicle.contact}</p>
                </div>
              </div>
            </div>

            {/* Reported Issues */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Reported Issues
              </h2>
              <ul className="space-y-2">
                {job.reportedIssues.map((issue, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-slate-700">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity Logs */}
            {job.logs && job.logs.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Activity Log
                </h2>
                <div className="space-y-3">
                  {job.logs.map((log, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{log.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {log.by?.name || "System"} • {new Date(log.at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Update Form */}
            {canEdit && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Update Job Card
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input-field"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="awaiting_parts">Awaiting Parts</option>
                      <option value="done">Done</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assigned Technician
                    </label>
                    <input
                      type="text"
                      placeholder="Technician ID (optional)"
                      className="input-field"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                    />
                    {job.assignedTo && (
                      <p className="text-xs text-slate-500 mt-1">
                        Current: {job.assignedTo.name || job.assignedTo.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Add Note
                    </label>
                    <textarea
                      className="input-field resize-none"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add update notes..."
                    ></textarea>
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="w-full btn-primary"
                  >
                    {updating ? (
                      <span className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Updating...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="font-bold text-slate-800 mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Created:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Updated:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {job.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Technician:</span>
                    <span className="font-semibold text-slate-800">
                      {job.assignedTo.name || "Assigned"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Delete Button */}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="w-full btn-danger"
              >
                Delete Job Card
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}