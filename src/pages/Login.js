import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("login");
  const [pendingUserId, setPendingUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef([]);

  const completeLogin = (data) => {
    if (data.user?.role !== 1) {
      toast.error("Access denied. Admin accounts only.");
      return;
    }
    toast.success(data.message || "Signed in successfully");
    setAuth({ ...auth, user: data.user, token: data.token });
    localStorage.setItem("auth", JSON.stringify(data));
    navigate("/admindashboard/admin-dashboard");
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.data.success) {
        if (res.data.requiresOtp) {
          setPendingUserId(res.data.userId);
          setStep("otp");
          setOtpDigits(["", "", "", "", "", ""]);
          setOtpError("");
          setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } else {
          completeLogin(res.data);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message) toast.error(error.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpDigit = (index, value) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);
    setOtpError("");
    if (cleaned && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);
    setOtpError("");
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 6) { setOtpError("Please enter the full 6-digit code."); return; }
    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await axios.post("/api/auth/verify-otp", { userId: pendingUserId, otp });
      if (res.data.success) {
        completeLogin(res.data);
      } else {
        setOtpError(res.data.message || "Invalid or expired verification code.");
      }
    } catch (error) {
      setOtpError(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Layout title="ConForum - Admin Login">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-50 mb-6 shadow-inner">
              {step === "login" ? (
                <svg className="w-10 h-10 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {step === "login" ? "Admin Portal" : "Check your email"}
            </h2>
            <p className="mt-3 text-gray-500 font-medium">
              {step === "login"
                ? "Sign in with your administrator credentials"
                : "Enter the 6-digit code sent to your inbox"}
            </p>
          </div>

          {step === "login" ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-widest" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="admin@conforum.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                    })}
                    className={`appearance-none block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600 sm:text-sm transition-all duration-200 bg-gray-50 ${
                      errors.email ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 italic">{errors.email.message}</p>}
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
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className={`appearance-none block w-full px-4 py-4 border placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600 sm:text-sm transition-all duration-200 bg-gray-50 ${
                      errors.password ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1 italic">{errors.password.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-2xl text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-teal-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
              >
                {isSubmitting ? "Signing in..." : "Sign In to Admin Panel"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* OTP boxes */}
              <div className="flex gap-3 justify-center">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpDigit(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-2xl border-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all ${
                      otpError ? "border-red-400 bg-red-50" : digit ? "border-teal-500 bg-teal-50" : "border-gray-200"
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-red-500 text-sm text-center italic">{otpError}</p>
              )}

              <p className="text-gray-400 text-xs text-center">This code expires in 10 minutes.</p>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-2xl text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-teal-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
              >
                {isVerifying ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                onClick={() => { setStep("login"); setPendingUserId(null); setOtpError(""); }}
                className="w-full text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors text-center py-2"
              >
                ← Back to login
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Login;