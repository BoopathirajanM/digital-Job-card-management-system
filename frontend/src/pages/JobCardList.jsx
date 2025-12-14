import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../lib/api";

export default function JobCardList() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchCards();
  }, []);

  useEffect(() => {
    // Filter cards based on search and status
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.vehicle.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((card) => card.status === statusFilter);
    }

    setFilteredCards(filtered);
  }, [searchTerm, statusFilter, cards]);

  async function fetchCards() {
    try {
      const res = await api.get("/jobcards");
      setCards(res.data);
      setFilteredCards(res.data);
    } catch (e) {
      setErr("Failed to fetch job cards.", e);
    } finally {
      setLoading(false);
    }
  }

  const statusOptions = [
    { value: "all", label: "All Status", count: cards.length },
    { value: "new", label: "New", count: cards.filter((c) => c.status === "new").length },
    { value: "in_progress", label: "In Progress", count: cards.filter((c) => c.status === "in_progress").length },
    { value: "awaiting_parts", label: "Awaiting Parts", count: cards.filter((c) => c.status === "awaiting_parts").length },
    { value: "done", label: "Done", count: cards.filter((c) => c.status === "done").length },
    { value: "closed", label: "Closed", count: cards.filter((c) => c.status === "closed").length },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  if (err) {
    return (
      <Layout>
        <div className="alert-error">
          <p className="text-red-700 font-medium">{err}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Job Cards</h1>
            <p className="text-slate-600">
              Manage and track all service requests
            </p>
          </div>

          <Link to="/jobcards/new" className="btn-primary">
            Create New Job Card
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Search by job number, customer, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-600">
              Showing <span className="font-bold text-blue-600">{filteredCards.length}</span> of{" "}
              <span className="font-bold">{cards.length}</span> job cards
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Job Cards Table */}
        <div className="glass-card overflow-hidden">
          {filteredCards.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                No job cards found
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first job card to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link to="/jobcards/new" className="btn-primary inline-block">
                  Create Job Card
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell font-semibold text-left">Job Number</th>
                    <th className="table-cell font-semibold text-left">Customer</th>
                    <th className="table-cell font-semibold text-left">Contact</th>
                    <th className="table-cell font-semibold text-left">Vehicle</th>
                    <th className="table-cell font-semibold text-left">Status</th>
                    <th className="table-cell font-semibold text-left">Payment</th>
                    <th className="table-cell font-semibold text-left">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCards.map((job) => (
                    <tr
                      key={job._id}
                      onClick={() => navigate(`/jobcards/${job._id}`)}
                      className="table-row"
                    >
                      <td className="table-cell font-bold text-blue-600">
                        {job.jobNumber}
                      </td>
                      <td className="table-cell font-medium">
                        {job.vehicle.ownerName}
                      </td>
                      <td className="table-cell text-slate-600">
                        {job.vehicle.contact}
                      </td>
                      <td className="table-cell">
                        <div>
                          <p className="font-medium">{job.vehicle.model}</p>
                          <p className="text-xs text-slate-500">{job.vehicle.regNo}</p>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge badge-${job.status.replace("_", "-")}`}>
                          {job.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge badge-${(job.paymentStatus || "pending").toLowerCase()}`}>
                          {(job.paymentStatus || "pending").toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell text-slate-600 text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
