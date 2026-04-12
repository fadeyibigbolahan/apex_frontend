import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Gift,
  Eye,
  EyeOff,
  CheckCircle,
  Users,
  ArrowLeft,
  ArrowRight,
  Zap,
  TrendingUp,
  Shield,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";
import apex from "../assets/apex.jpeg";

// ── tiny helpers ─────────────────────────────────────────────────────────────
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
      <div className="absolute inset-y-0 z-10 left-3 flex items-start pt-4 pointer-events-none">
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

const benefits = [
  {
    icon: Gift,
    color: "#C084FC",
    bg: "rgba(192, 132, 252, 0.15)",
    title: "5% referral bonus",
    desc: "Earned on every friend you refer",
  },
  {
    icon: TrendingUp,
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.15)",
    title: "3% retrading bonus",
    desc: "Reinvest early and get rewarded",
  },
  {
    icon: Shield,
    color: "#9333EA",
    bg: "rgba(147, 51, 234, 0.15)",
    title: "Bank-grade security",
    desc: "256-bit encryption on every transaction",
  },
  {
    icon: Zap,
    color: "#D8B4FE",
    bg: "rgba(216, 180, 254, 0.15)",
    title: "Up to 50% returns",
    desc: "In as little as 15 working days",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Animated stars and light effect for desktop left panel
  useEffect(() => {
    const container = document.getElementById("register-stars-container");
    if (!container) return;

    // Create stars
    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.className = "star";

      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2.5 + 0.5;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 5;
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

    // Create larger glowing orbs
    for (let i = 0; i < 15; i++) {
      const orb = document.createElement("div");
      orb.className = "orb";

      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 150 + 50;
      const duration = Math.random() * 20 + 20;
      const delay = Math.random() * 10;

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

  // Get referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) setFormData((prev) => ({ ...prev, referralCode: refCode }));
  }, [location]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const map = {
      0: ["Weak", "bg-red-400"],
      1: ["Weak", "bg-red-400"],
      2: ["Fair", "bg-amber-400"],
      3: ["Fair", "bg-amber-400"],
      4: ["Strong", "bg-emerald-500"],
      5: ["Strong", "bg-emerald-500"],
    };
    const [label, color] = map[score];
    setPasswordStrength({ score, label, color });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For username: only lowercase letters, numbers, and underscores
    if (name === "username") {
      const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
      setFormData({
        ...formData,
        [name]: cleanValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "email" ? value.trim().toLowerCase() : value,
      });
    }

    setError("");
    setSuccess("");
    if (name === "password") checkPasswordStrength(value);
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Enter a valid email address");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (formData.username.length > 20) {
      setError("Username must be less than 20 characters");
      return false;
    }
    if (!/^[a-z0-9_]+$/.test(formData.username)) {
      setError(
        "Username can only contain lowercase letters, numbers, and underscores",
      );
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}auth/register`, {
        email: formData.email,
        password: formData.password,
        referralCode: formData.username, // Username becomes referral code
        referredBy: formData.referralCode || undefined,
      });

      const { token, data } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      login({
        id: data.user._id,
        email: data.user.email,
        username: data.user.referralCode,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        referralCode: data.user.referralCode,
        totalInvested: data.user.totalInvested,
        totalWithdrawn: data.user.totalWithdrawn,
        referralBonus: data.user.referralBonus,
        retradingBonus: data.user.retradingBonus,
        hasBankDetails: false,
      });

      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div
      className="flex min-h-screen w-full relative"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap'); 
        .serif{font-family:'DM Serif Display',Georgia,serif;}
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
        }
        
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
        
        .bg-red-400 { background-color: #f87171; }
        .bg-amber-400 { background-color: #fbbf24; }
        .bg-emerald-500 { background-color: #10b981; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-white\/10 { background-color: rgba(255, 255, 255, 0.1); }

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

        #register-stars-container, #mobile-stars-container {
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
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
            zIndex: 0,
          }}
        />
        <div id="register-stars-container" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(72, 27, 115, 0.1) 0%, transparent 60%)",
            zIndex: 2,
          }}
        />

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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative z-10"
        >
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4">
            Join 15,000+ investors
          </p>
          <h2 className="serif text-5xl text-white leading-[1.1] mb-5">
            Your wealth
            <br />
            starts <em className="not-italic text-purple-300">here.</em>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Choose a unique username and create your account in under two
            minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 space-y-3"
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-4 glass-card rounded-xl px-4 py-3.5"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: b.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: b.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex flex-col lg:bg-white overflow-y-auto relative"
        style={{ zIndex: 10 }}
      >
        {/* Mobile version with galaxy background */}
        <div className="lg:hidden relative min-h-screen">
          <div
            className="fixed inset-0 w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
              zIndex: 0,
            }}
          />
          <div id="mobile-stars-container" className="fixed inset-0" />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(114, 58, 105, 0.15) 0%, transparent 70%)",
              zIndex: 2,
            }}
          />

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
              <div className="mb-7">
                <h1 className="serif text-3xl text-white mb-1.5">
                  Create account
                </h1>
                <p className="text-sm text-gray-300">
                  Choose a unique username to get started
                </p>
              </div>

              <AnimatePresence>
                {formData.referralCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 flex items-center gap-3 bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 overflow-hidden"
                  >
                    <Gift className="w-4 h-4 text-purple-300 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-200">
                        Referral code applied
                      </p>
                      <p className="text-xs text-purple-300">
                        You'll earn a 5% bonus on your first investment
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-300">
                      Username <span className="text-red-400">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 z-10 left-3 flex items-start pt-4 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g., john_doe"
                      required
                      className="input-base mobile-input"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Lowercase letters, numbers, and underscores only. 3-20
                    characters.
                  </p>
                </div>

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
                      autoComplete="new-password"
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
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div
                            key={l}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              l <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-300">
                        Strength:{" "}
                        <span className="font-medium text-white">
                          {passwordStrength.label}
                        </span>
                        {" · "}min. 6 characters
                      </p>
                    </div>
                  )}
                </InputField>

                {/* Confirm password */}
                <InputField icon={Lock} label="Confirm password">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      className={`input-base mobile-input pr-12 ${
                        passwordsMismatch
                          ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-400"
                          : passwordsMatch
                            ? "border-emerald-500/50 focus:ring-emerald-500/20 focus:border-emerald-400"
                            : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-300 hover:text-white transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordsMatch && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                    </p>
                  )}
                </InputField>

                {/* Referral code (optional) */}
                <InputField
                  icon={Gift}
                  label="Referral code (optional)"
                  optional
                  hint="Enter a friend's username to earn 5% bonus"
                >
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="e.g., john_doe"
                    className="input-base mobile-input"
                  />
                </InputField>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-400 focus:ring-purple-500 flex-shrink-0"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-300 leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-purple-300 hover:text-purple-200 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-purple-300 hover:text-purple-200 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-300 hover:text-purple-200 font-semibold"
                >
                  Sign in
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
              <div className="mb-7">
                <h1 className="serif text-3xl text-gray-900 mb-1.5">
                  Create account
                </h1>
                <p className="text-sm text-gray-500">
                  Choose a unique username to get started
                </p>
              </div>

              <AnimatePresence>
                {formData.referralCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 overflow-hidden"
                  >
                    <Gift className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-800">
                        Referral code applied
                      </p>
                      <p className="text-xs text-purple-600">
                        You'll earn a 5% bonus on your first investment
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Username <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g., john_doe"
                      required
                      className="w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-gray-50"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Lowercase letters, numbers, and underscores only. 3-20
                    characters.
                  </p>
                </div>

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
                      autoComplete="new-password"
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
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div
                            key={l}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              l <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-gray-100"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Strength:{" "}
                        <span className="font-medium text-gray-700">
                          {passwordStrength.label}
                        </span>
                        {" · "}min. 6 characters
                      </p>
                    </div>
                  )}
                </InputField>

                {/* Confirm password */}
                <InputField icon={Lock} label="Confirm password">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      className={`input-base desktop-input pr-12 ${
                        passwordsMismatch
                          ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                          : passwordsMatch
                            ? "border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-400"
                            : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordsMatch && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                    </p>
                  )}
                </InputField>

                {/* Referral code (optional) */}
                <InputField
                  icon={Gift}
                  label="Referral code (optional)"
                  optional
                  hint="Enter a friend's username to earn 5% bonus"
                >
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="e.g., john_doe"
                    className="input-base desktop-input"
                  />
                </InputField>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 flex-shrink-0"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-500 leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign in
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
    </div>
  );
};

export default Register;
