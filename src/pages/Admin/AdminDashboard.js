import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const STATUS_STYLES = {
  approved: "bg-green-50 text-green-800",
  pending: "bg-amber-50 text-amber-800",
  rejected: "bg-red-50 text-red-800",
};

const StatCard = ({ label, value, sub, subColor }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </p>
    <p className={`text-3xl font-extrabold ${subColor ?? "text-gray-900"}`}>
      {value !== null ? value : (
        <span className="inline-block w-12 h-7 bg-gray-100 rounded animate-pulse" />
      )}
    </p>
    <p className={`text-xs mt-1 font-medium ${subColor ?? "text-gray-400"}`}>
      {sub}
    </p>
  </div>
);

const DonutChart = ({ approved, pending, rejected }) => {
  const total = approved + pending + rejected;
  if (total === 0) return null;

  const r = 40;
  const circ = 2 * Math.PI * r;

  const approvedDash = (approved / total) * circ;
  const pendingDash = (pending / total) * circ;
  const rejectedDash = (rejected / total) * circ;

  const approvedOffset = 0;
  const pendingOffset = -approvedDash;
  const rejectedOffset = -(approvedDash + pendingDash);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#EAF3DE" strokeWidth="18"
          transform="rotate(-90 55 55)"
          strokeDasharray={`${approvedDash} ${circ - approvedDash}`}
          strokeDashoffset={approvedOffset}
        />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#FAEEDA" strokeWidth="18"
          transform="rotate(-90 55 55)"
          strokeDasharray={`${pendingDash} ${circ - pendingDash}`}
          strokeDashoffset={pendingOffset}
        />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#4B707A" strokeWidth="18"
          transform="rotate(-90 55 55)"
          strokeDasharray={`${rejectedDash} ${circ - rejectedDash}`}
          strokeDashoffset={rejectedOffset}
        />
        <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="700" fill="#111">{total}</text>
        <text x="55" y="65" textAnchor="middle" fontSize="10" fill="#888">total</text>
      </svg>

      <div className="w-full space-y-2">
        {[
          { label: "Approved", value: approved, color: "bg-green-700" },
          { label: "Pending", value: pending, color: "bg-amber-500" },
          { label: "Rejected", value: rejected, color: "bg-teal-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${color}`} />
            <span className="text-gray-500">{label}</span>
            <span className="ml-auto font-bold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ approved: null, pending: null, rejected: null });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
          axios.get("/api/conference/all-conferences"),
          axios.get("/api/conference/pending"),
          axios.get("/api/conference/rejected-conferences"),
        ]);

        const approved = approvedRes.data ?? [];
        const pending = pendingRes.data ?? [];
        const rejected = rejectedRes.data ?? [];

        setStats({
          approved: approved.length,
          pending: pending.length,
          rejected: rejected.length,
        });

        const all = [
          ...pending.map((c) => ({ ...c, status: "pending" })),
          ...approved.map((c) => ({ ...c, status: "approved" })),
          ...rejected.map((c) => ({ ...c, status: "rejected" })),
        ];

        const sorted = all
          .filter((c) => c.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setRecent(sorted);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const total = (stats.approved ?? 0) + (stats.pending ?? 0) + (stats.rejected ?? 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Platform overview — all conference requests
            </p>
          </div>

          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest"
            style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
          >
            System Superuser
          </span>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total conferences" value={stats.approved !== null ? total : null} sub="All time" />
          <StatCard label="Pending requests" value={stats.pending} sub="Awaiting review" subColor="text-amber-600" />
          <StatCard label="Approved" value={stats.approved} sub="Active conferences" subColor="text-green-700" />
          <StatCard label="Rejected" value={stats.rejected} sub="Not approved" subColor="text-teal-700" />
        </div>

        {/* Table + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">
                Recent conference requests
              </h2>

              <a
                href="/admindashboard/pending-requests"
                className="text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                View all
              </a>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Conference</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                        No recent conferences found.
                      </td>
                    </tr>
                  ) : (
                    recent.map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <p className="text-sm font-bold text-gray-900">{c.acronym}</p>
                          <p className="text-xs text-gray-400">{c.conferenceName}</p>
                        </td>

                        <td className="px-6 py-3 text-sm text-gray-500">
                          {c.city}, {c.country}
                        </td>

                        <td className="px-6 py-3 text-sm text-gray-500">
                          {c.createdAt ? c.createdAt.slice(0, 10) : "-"}
                        </td>

                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[c.status]}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-6">
              Status breakdown
            </h2>

            {stats.approved !== null ? (
              <DonutChart
                approved={stats.approved}
                pending={stats.pending}
                rejected={stats.rejected}
              />
            ) : (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Review pending requests", href: "/admindashboard/pending-requests", count: stats.pending, color: "text-amber-600" },
            { label: "View approved conferences", href: "/admindashboard/all-conferences", count: stats.approved, color: "text-green-700" },
            { label: "View rejected conferences", href: "/admindashboard/rejected-conferences", count: stats.rejected, color: "text-teal-700" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm hover:border-teal-100 transition-all"
            >
              <span className="text-sm font-bold text-gray-700">{link.label}</span>
              <span className={`text-lg font-extrabold ${link.color}`}>
                {link.count ?? "—"}
              </span>
            </a>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;