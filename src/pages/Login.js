import React from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.data.success) {
        if (res.data.user?.role !== 1) {
          toast.error("Access denied. Admin accounts only.");
          return;
        }
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/admindashboard/admin-dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout title="Confizio - Admin Login">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 mb-6 shadow-inner">
              <svg className="w-10 h-10" style={{ color: "#9B0020" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Portal</h2>
            <p className="mt-3 text-gray-500 font-medium">Sign in with your administrator credentials</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-widest" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="admin@confizio.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 sm:text-sm transition-all duration-200 bg-gray-50 ${
                    errors.email ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 italic">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-widest" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-700 sm:text-sm transition-all duration-200 bg-gray-50 ${
                    errors.password ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 italic">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-2xl text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-red-900/20"
                style={{ backgroundColor: "#9B0020" }}
              >
                Sign In to Admin Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
