import React from "react";
import { useNavigate } from "react-router-dom";

const Pagenotfound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-8xl font-extrabold" style={{ color: "#9B0020" }}>404</h1>
      <p className="mt-4 text-2xl font-bold text-gray-800">Page Not Found</p>
      <p className="mt-2 text-gray-500 font-medium">The page you are looking for does not exist in the admin panel.</p>
      <button
        onClick={() => navigate("/admindashboard/admin-dashboard")}
        className="mt-8 px-6 py-3 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
        style={{ backgroundColor: "#9B0020" }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Pagenotfound;
