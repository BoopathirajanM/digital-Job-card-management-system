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
    vehicleType: "Car",
    regNo: "",
    model: "",
    ownerName: "",
    contact: "",
    kmReading: "",
    issues: "",
    commonIssues: [],
    customIssue: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCheckboxChange(issue) {
    const isChecked = form.commonIssues.includes(issue);
    if (isChecked) {
      setForm({
        ...form,
        commonIssues: form.commonIssues.filter((i) => i !== issue),
      });
    } else {
      setForm({
        ...form,
        commonIssues: [...form.commonIssues, issue],
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      // Combine common issues and custom issue
      const allIssues = [
        ...form.commonIssues,
        ...(form.customIssue ? [form.customIssue] : []),
      ].filter(Boolean);

      if (allIssues.length === 0) {
        setErr("Please select or enter at least one issue");
        setLoading(false);
        return;
      }

      const payload = {
        vehicle: {
          type: form.vehicleType,
          regNo: form.regNo,
          model: form.model,
          ownerName: form.ownerName,
          contact: form.contact,
          kmReading: form.kmReading ? parseInt(form.kmReading) : 0,
        },
        reportedIssues: allIssues,
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
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>

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

              {/* Common Issues Checkboxes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Common Issues (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "General Service",
                    "Engine Making Noise",
                    "Brake Pads Worn Out",
                    "AC Not Working",
                    "Oil Change Required",
                    "Battery Issue",
                    "Tire Replacement",
                    "Suspension Problem",
                  ].map((issue) => (
                    <label
                      key={issue}
                      className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={form.commonIssues.includes(issue)}
                        onChange={() => handleCheckboxChange(issue)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-700">{issue}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Issue Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Other Issues (Optional)
                </label>
                <textarea
                  name="customIssue"
                  value={form.customIssue}
                  onChange={handleChange}
                  placeholder="Describe any other issues not listed above..."
                  rows="3"
                  className="input-field resize-none"
                ></textarea>
                <p className="text-xs text-slate-500 mt-2">
                  {form.commonIssues.length > 0 && (
                    <span className="text-blue-600 font-semibold">
                      {form.commonIssues.length} common issue(s) selected
                    </span>
                  )}
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