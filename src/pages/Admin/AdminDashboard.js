import React from "react";
import Sidebar from "../../components/AdminSidebar";
import Layout from "../../components/Layout";

const AdminDashboard = () => {
  return (
    <Layout title="Administrator Control Center">
      <div className="relative flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 shadow-2xl min-h-[400px] flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900/40 to-transparent"></div>
              <div className="relative z-10 p-12 lg:p-20 max-w-2xl">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-lg shadow-red-900/40">
                  System Superuser
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
                  Admin <span className="text-red-500">Dashboard</span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-300 font-medium leading-relaxed mb-10">
                  Welcome to the command center. Oversee global platform operations, approve institutional requests, and manage user security protocols.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="h-1 w-24 bg-red-600 rounded-full"></div>
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Total Control Platform</span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Pending Requests", link: "/admindashboard/pending-requests", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z", color: "bg-amber-50 text-amber-700" },
                { label: "Approved Conferences", link: "/admindashboard/all-conferences", icon: "m4.5 12.75 6 6 9-13.5", color: "bg-green-50 text-green-700" },
                { label: "Rejected Conferences", link: "/admindashboard/rejected-conferences", icon: "M6 18 18 6M6 6l12 12", color: "bg-red-50 text-red-700" },
              ].map((card, i) => (
                <a
                  key={i}
                  href={card.link}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center space-x-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-800 text-sm">{card.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
