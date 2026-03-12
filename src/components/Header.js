import React from "react";
import { useAuth } from "../context/Auth";
import { toast } from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: "", roles: [] });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav style={{ backgroundColor: "#9B0020" }} className="px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <NavLink to="/admindashboard/admin-dashboard" className="text-white text-xl font-extrabold tracking-wide">
            ConForum <span className="text-red-200 font-medium">Admin</span>
          </NavLink>
        </div>

        {auth?.user ? (
          <div className="flex items-center space-x-4">
            <span className="text-red-100 text-sm font-medium hidden md:block">
              Welcome, <span className="text-white font-bold">{auth.user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
