import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const navItems = [
    {
      to: "/admindashboard/admin-dashboard",
      label: "Dashboard",
      icon: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
    },
    {
      to: "/admindashboard/profile",
      label: "Profile",
      icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    },
    {
      to: "/admindashboard/create-conference",  // 👈 NEW
      label: "Create Conf",
      icon: "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
    {
      to: "/admindashboard/pending-requests",
      label: "Requests",
      icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
    },
    {
      to: "/admindashboard/all-conferences",
      label: "Approved",
      icon: "m4.5 12.75 6 6 9-13.5",
    },
    {
      to: "/admindashboard/rejected-conferences",
      label: "Rejected",
      icon: "M6 18 18 6M6 6l12 12",
    },
    {
      to: "/admindashboard/update-conference",
      label: "Edit Conf",
      icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    },
    {
      to: "/admindashboard/send-invite",
      label: "Send Invite",
      icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
    },
  ];

  return (
    <div
      className={`flex flex-col ${isExpanded ? "w-72" : "w-24"
        } min-h-screen transition-all duration-500 border-r border-teal-100 shadow-xl overflow-hidden  fixed top-0 left-0`}
      style={{ background: "#F8FAF9" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between h-20 px-6"
        style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
      >
        <span
          className={`text-white font-extrabold text-sm tracking-widest uppercase transition-opacity duration-300 ${!isExpanded ? "hidden opacity-0" : ""
            }`}
        >
          Admin Panel
        </span>
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          {isExpanded ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Teal accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #4B707A, #7F9C8E, #C5D9A4)" }} />

      {/* Nav */}
      <nav className="flex flex-col flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-xl transition-all duration-300 group ${isActive
                ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100"
                : "text-gray-500 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={`size-6 group-hover:scale-110 transition-transform ${!isExpanded ? "mx-auto" : ""
                }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {isExpanded && (
              <span className="ml-4 font-semibold text-sm tracking-wide">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom strip */}
      {isExpanded && (
        <div className="p-4 border-t border-teal-100">
          <p className="text-xs font-bold tracking-widest uppercase text-center" style={{ color: "#A8C4B8" }}>
            ConForum Admin
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;