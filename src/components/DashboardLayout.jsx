import React, { useState } from "react";
import Sidebar from "./AdminSidebar"; // path to your sidebar component
import Header from "./Header"; // use your existing header component
import { Outlet } from "react-router-dom"; // optional, for nested routes

const DashboardLayout = ({ children }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
            />

            {/* Main content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarExpanded ? "ml-72" : "ml-24"
                    }`}
            >
                {/* Header */}
                <Header />

                {/* Page content */}
                <main className="flex-1 p-8 lg:p-10">
                    {children}
                    {/* Optional nested routes */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;