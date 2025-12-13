import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../lib/api";

export default function JobCardForm() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Redirect if not logged in
  if (!token) {
    navigate("/");
  }

  const [form, setForm] = useState({
    regNo: "",
    model: "",
    ownerName: "",
    contact: "",
    kmReading: "",
    issues: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const payload = {
        vehicle: {
          regNo: form.regNo,
          model: form.model,
          ownerName: form.ownerName,
          contact: form.contact,
          kmReading: form.kmReading ? parseInt(form.kmReading) : 0,
        },
        reportedIssues: form.issues
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await api.post("/jobcards", payload);

      // Show success and navigate to the created job card
      navigate(`/jobcards/${res.data._id}`);
    } catch (error) {
      setErr(error.response?.data?.msg || "Failed to create job card");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={() => navigate("/jobcards")}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              ← Back to Job Cards
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gradient">Create New Job Card</h1>
          <p className="text-slate-600 mt-2">
            Fill in the details to create a new service request
          </p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {err && (
            <div className="alert-error mb-6">
              <p className="text-red-700 font-medium">{err}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Information Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Vehicle Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={form.regNo}
                    onChange={handleChange}
                    required
                    placeholder="TN 10 AB 1234"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    required
                    placeholder="Maruti Swift VXI"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    KM Reading
                  </label>
                  <input
                    type="number"
                    name="kmReading"
                    value={form.kmReading}
                    onChange={handleChange}
                    placeholder="45000"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Customer Information Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    required
                    placeholder="Rajesh Kumar"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Issues Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Reported Issues
              </h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Issues / Complaints *
                </label>
                <textarea
                  name="issues"
                  value={form.issues}
                  onChange={handleChange}
                  required
                  placeholder="AC not cooling, Engine making noise, Brake pads worn out"
                  rows="4"
                  className="input-field resize-none"
                ></textarea>
                <p className="text-xs text-slate-500 mt-2">
                  Separate multiple issues with commas
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating Job Card...
                  </span>
                ) : (
                  "Create Job Card"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/jobcards")}
                className="btn-outline flex-1"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="font-bold text-slate-800 mb-2">Quick Tips</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Enter vehicle registration in standard format (e.g., TN 10 AB 1234)</li>
            <li>• List all customer complaints clearly for accurate diagnosis</li>
            <li>• Job number will be auto-generated after creation</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}