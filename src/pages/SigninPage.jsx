import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

// ═════════════════════════════════════════════════════════════════════════════
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "email" ? value.trim().toLowerCase() : value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${url}auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      const { token, data } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      login({
        id: data.user._id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        referralCode: data.user.referralCode,
        totalInvested: data.user.totalInvested,
        totalWithdrawn: data.user.totalWithdrawn,
        referralBonus: data.user.referralBonus,
        retradingBonus: data.user.retradingBonus,
        hasBankDetails: data.user.bankDetails?.accountNumber ? true : false,
      });
      setSuccess("Signed in! Redirecting…");
      setTimeout(
        () => navigate(data.user.role === "admin" ? "/admin" : "/dashboard"),
        1000,
      );
    } catch (err) {
      console.log("error signin", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    if (!resetEmail) {
      setResetError("Please enter your email address");
      setResetLoading(false);
      return;
    }
    try {
      await axios.post(`${url}auth/forgot-password`, { email: resetEmail });
      setResetSent(true);
    } catch (err) {
      setResetError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setResetEmail("");
    setResetError("");
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap'); .serif{font-family:'DM Serif Display',Georgia,serif;}`}</style>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gray-950 flex-col justify-between p-12">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 75%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(5,150,105,0.12) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            APEX <span className="text-emerald-400 font-normal">Trading</span>
          </span>
        </motion.div>

        {/* Main copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
            Welcome back
          </p>
          <h2 className="serif text-5xl text-white leading-[1.1] mb-5">
            Good to see
            <br />
            you <em className="not-italic text-emerald-400">again.</em>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Your investments are working while you're away. Sign in to check
            your returns and manage your portfolio.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative grid grid-cols-2 gap-3"
        >
          {[
            { value: "15,000+", label: "Active investors", color: "#60A5FA" },
            { value: "₦1.25B+", label: "Total invested", color: "#34D399" },
            { value: "₦875M+", label: "Paid out to date", color: "#A78BFA" },
            { value: "99.8%", label: "On-time payments", color: "#FBBF24" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="bg-white/5 border border-white/8 rounded-xl px-4 py-3.5"
            >
              <p
                className="text-xl font-bold mb-0.5"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-gray-900">
              APEX <span className="text-emerald-600 font-normal">Trading</span>
            </span>
          </div>
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            {/* Header */}
            <div className="mb-7">
              <h1 className="serif text-3xl text-gray-900 mb-1.5">Sign in</h1>
              <p className="text-sm text-gray-500">
                Access your investment dashboard
              </p>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-700">{success}</p>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold leading-none">
                      !
                    </span>
                  </div>
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create account
              </Link>
            </p>
            <div className="mt-3 text-center hidden lg:block">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition"
              >
                <ArrowLeft className="w-3 h-3" /> Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Reset password</h3>
                <button
                  onClick={closeForgot}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!resetSent ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                      Enter your email and we'll send you instructions to reset
                      your password.
                    </p>

                    <AnimatePresence>
                      {resetError && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold leading-none">
                              !
                            </span>
                          </div>
                          <p className="text-xs text-red-700">{resetError}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => {
                              setResetEmail(e.target.value);
                              setResetError("");
                            }}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-60"
                      >
                        {resetLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                            Sending…
                          </>
                        ) : (
                          "Send reset instructions"
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-2"
                  >
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">
                      Check your inbox
                    </h4>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                      Reset instructions sent to{" "}
                      <span className="font-medium text-gray-700">
                        {resetEmail}
                      </span>
                    </p>
                    <button
                      onClick={closeForgot}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition"
                    >
                      Back to sign in
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
