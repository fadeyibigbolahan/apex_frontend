import React, { useState, useEffect } from "react";
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
import apex from "../assets/apex.jpeg";

// ── Input Field Component ───────────────────────────────────────────────────
const InputField = ({
  icon: Icon,
  label,
  hint,
  error: fieldError,
  children,
  optional,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-medium lg:text-gray-700 text-gray-300">
        {label}
      </label>
      {optional && <span className="text-xs text-gray-400">Optional</span>}
    </div>
    <div className="relative">
      <div className="absolute z-10 inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 lg:text-gray-400 text-gray-300" />
      </div>
      {children}
    </div>
    {hint && !fieldError && (
      <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
    )}
    {fieldError && <p className="mt-1.5 text-xs text-red-400">{fieldError}</p>}
  </div>
);

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

  // Animated stars and light effect for desktop left panel
  useEffect(() => {
    const container = document.getElementById("login-stars-container");
    if (!container) return;

    // Create stars
    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.className = "star";

      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;

      // Random size (0.5px to 3px)
      const size = Math.random() * 2.5 + 0.5;

      // Random animation duration (2s to 6s)
      const duration = Math.random() * 4 + 2;

      // Random delay
      const delay = Math.random() * 5;

      // Random opacity
      const opacity = Math.random() * 0.7 + 0.3;

      star.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        opacity: ${opacity};
        box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        z-index: 1;
      `;

      container.appendChild(star);
    }

    // Create larger glowing orbs using your color palette
    for (let i = 0; i < 15; i++) {
      const orb = document.createElement("div");
      orb.className = "orb";

      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 150 + 50;
      const duration = Math.random() * 20 + 20;
      const delay = Math.random() * 10;

      // Your color palette
      const colors = ["#481B73", "#5A2A71", "#723A69", "#8A4A61"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      orb.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, ${color}80, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: float ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
        z-index: 0;
      `;

      container.appendChild(orb);
    }

    // Create shooting stars
    for (let i = 0; i < 8; i++) {
      const shootingStar = document.createElement("div");
      shootingStar.className = "shooting-star";

      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 3 + 2;

      shootingStar.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent);
        transform: rotate(-45deg);
        filter: blur(1px);
        animation: shoot ${duration}s linear infinite;
        animation-delay: ${delay}s;
        opacity: 0;
        z-index: 2;
      `;

      container.appendChild(shootingStar);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  // Animated stars and light effect for mobile
  useEffect(() => {
    const container = document.getElementById("mobile-stars-container");
    if (!container) return;

    // Simpler stars for mobile (better performance)
    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";

      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 0.5;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.6 + 0.2;

      star.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        opacity: ${opacity};
        box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        z-index: 1;
      `;

      container.appendChild(star);
    }

    // Simpler orbs for mobile
    for (let i = 0; i < 8; i++) {
      const orb = document.createElement("div");
      orb.className = "orb";

      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 100 + 30;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 10;

      const colors = ["#481B73", "#5A2A71", "#723A69"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      orb.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, ${color}60, transparent 70%);
        border-radius: 50%;
        filter: blur(30px);
        animation: float ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
        z-index: 0;
      `;

      container.appendChild(orb);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

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
      className="flex min-h-screen w-full relative"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap'); 
        .serif{font-family:'DM Serif Display',Georgia,serif;}
        
        /* Glass morphism effects */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
        }
        
        /* Input styles - fixed positioning */
        input, select, textarea {
          font-size: 16px !important;
        }
        
        .input-base {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem;
          font-size: 16px;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        
        /* Desktop input styles */
        .desktop-input {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #111827;
        }
        .desktop-input::placeholder {
          color: #9ca3af;
        }
        .desktop-input:focus {
          background-color: white;
          border-color: #9333EA;
          outline: none;
          ring: 2px solid rgba(147, 51, 234, 0.2);
        }
        
        /* Mobile input styles */
        .mobile-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(147, 51, 234, 0.3);
          color: white;
        }
        .mobile-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .mobile-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(147, 51, 234, 0.6);
          outline: none;
        }
        
        /* Password strength bar colors */
        .bg-red-400 { background-color: #f87171; }
        .bg-amber-400 { background-color: #fbbf24; }
        .bg-emerald-500 { background-color: #10b981; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-white\/10 { background-color: rgba(255, 255, 255, 0.1); }

        /* Star animations */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(2%, 2%) scale(1.05); }
          50% { transform: translate(-1%, 3%) scale(0.95); }
          75% { transform: translate(-2%, -1%) scale(1.02); }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }

        #login-stars-container, #mobile-stars-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .star, .orb, .shooting-star {
          will-change: transform, opacity;
        }
      `}</style>

      {/* Desktop Left Panel with Galaxy Effect */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
            zIndex: 0,
          }}
        />

        {/* Stars Container for Desktop */}
        <div id="login-stars-container" />

        {/* Subtle radial gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(72, 27, 115, 0.1) 0%, transparent 60%)",
            zIndex: 2,
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <div className="w-[50px] h-[50px] rounded-lg flex items-center justify-center">
            <img src={apex} alt="apex logo" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            APEX <span className="text-purple-300 font-normal">Trading</span>
          </span>
        </motion.div>

        {/* Main copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative z-10"
        >
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4">
            Welcome back
          </p>
          <h2 className="serif text-5xl text-white leading-[1.1] mb-5">
            Good to see
            <br />
            you <em className="not-italic text-purple-300">again.</em>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Your investments are working while you're away. Sign in to check
            your returns and manage your portfolio.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 grid grid-cols-2 gap-3"
        >
          {[
            { value: "15,000+", label: "Active investors", color: "#C084FC" },
            { value: "₦1.25B+", label: "Total invested", color: "#A855F7" },
            { value: "₦875M+", label: "Paid out to date", color: "#9333EA" },
            { value: "99.8%", label: "On-time payments", color: "#D8B4FE" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="glass-card rounded-xl px-4 py-3.5"
            >
              <p
                className="text-xl font-bold mb-0.5"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex flex-col lg:bg-white overflow-y-auto relative"
        style={{ zIndex: 10 }}
      >
        {/* Mobile version with galaxy background */}
        <div className="lg:hidden relative min-h-screen">
          {/* Gradient Background for Mobile */}
          <div
            className="fixed inset-0 w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
              zIndex: 0,
            }}
          />

          {/* Stars Container for Mobile */}
          <div id="mobile-stars-container" className="fixed inset-0" />

          {/* Mobile gradient overlay */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(114, 58, 105, 0.15) 0%, transparent 70%)",
              zIndex: 2,
            }}
          />

          {/* Mobile top bar with semi-transparent background */}
          <div className="relative z-10 flex items-center justify-between p-5 border-b border-purple-500/30 glass-card">
            <div className="flex items-center gap-2">
              <div className="w-[50px] h-[50px] rounded-lg flex items-center justify-center">
                <img src={apex} alt="apex logo" />
              </div>
              <span className="font-semibold text-white">
                APEX{" "}
                <span className="text-purple-300 font-normal">Trading</span>
              </span>
            </div>
            <Link
              to="/"
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center p-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm"
            >
              {/* Header */}
              <div className="mb-7">
                <h1 className="serif text-3xl text-white mb-1.5">Sign in</h1>
                <p className="text-sm text-gray-300">
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
                    className="mb-4 flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-3"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <p className="text-sm text-emerald-200">{success}</p>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 flex items-center gap-2.5 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3"
                  >
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold leading-none">
                        !
                      </span>
                    </div>
                    <p className="text-sm text-red-200">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <InputField icon={Mail} label="Email address">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="input-base mobile-input"
                  />
                </InputField>

                {/* Password */}
                <InputField icon={Lock} label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="input-base mobile-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-300 hover:text-white transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </InputField>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
              <p className="mt-6 text-center text-sm text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-purple-300 hover:text-purple-200 font-semibold"
                >
                  Create account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Desktop version */}
        <div className="hidden lg:block">
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
                <InputField icon={Mail} label="Email address">
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="input-base desktop-input"
                    />
                  </div>
                </InputField>

                {/* Password */}
                <InputField icon={Lock} label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="input-base desktop-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </InputField>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Create account
                </Link>
              </p>
              <div className="mt-3 text-center">
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
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
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
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-60"
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
                      className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition"
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
