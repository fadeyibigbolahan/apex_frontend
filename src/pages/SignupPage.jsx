import React, { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

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
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {optional && <span className="text-xs text-gray-400">Optional</span>}
    </div>
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      {children}
    </div>
    {hint && !fieldError && (
      <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
    )}
    {fieldError && <p className="mt-1.5 text-xs text-red-500">{fieldError}</p>}
  </div>
);

const benefits = [
  {
    icon: Gift,
    color: "#2563EB",
    bg: "#EFF6FF",
    title: "5% referral bonus",
    desc: "Earned on every friend you refer",
  },
  {
    icon: TrendingUp,
    color: "#059669",
    bg: "#ECFDF5",
    title: "3% retrading bonus",
    desc: "Reinvest early and get rewarded",
  },
  {
    icon: Shield,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Bank-grade security",
    desc: "256-bit encryption on every transaction",
  },
  {
    icon: Zap,
    color: "#EA580C",
    bg: "#FFF7ED",
    title: "Up to 50% returns",
    desc: "In as little as 15 working days",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
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

  React.useEffect(() => {
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
    setFormData({
      ...formData,
      [name]: name === "email" ? value.trim().toLowerCase() : value,
    });
    setError("");
    setSuccess("");
    if (name === "password") checkPasswordStrength(value);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Enter a valid email address");
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
        referralCode: formData.referralCode || undefined,
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
        hasBankDetails: false,
      });
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
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
      className="flex min-h-screen w-full"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap'); .serif{font-family:'DM Serif Display',Georgia,serif;}`}</style>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gray-950 flex-col justify-between p-12">
        {/* background decoration */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(5,150,105,0.12) 0%, transparent 50%)",
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
            Join 15,000+ investors
          </p>
          <h2 className="serif text-5xl text-white leading-[1.1] mb-5">
            Your wealth
            <br />
            starts <em className="not-italic text-emerald-400">here.</em>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Create an account in under two minutes and start earning structured
            returns on your capital.
          </p>
        </motion.div>

        {/* Benefit cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative space-y-3"
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-xl px-4 py-3.5 backdrop-blur-sm"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: b.bg + "22" }}
                >
                  <Icon className="w-4 h-4" style={{ color: b.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </motion.div>
            );
          })}
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
              <h1 className="serif text-3xl text-gray-900 mb-1.5">
                Create account
              </h1>
              <p className="text-sm text-gray-500">
                Join Apex Trading and start investing today
              </p>
            </div>

            {/* Referral badge */}
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
                    <p className="text-xs text-purple-500">
                      You'll earn a 5% bonus on your first investment
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
              </InputField>

              {/* Password */}
              <InputField icon={Lock} label="Password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
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
                {/* Strength bar */}
                {formData.password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((l) => (
                        <div
                          key={l}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${l <= passwordStrength.score ? passwordStrength.color : "bg-gray-100"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Strength:{" "}
                      <span className="font-medium text-gray-600">
                        {passwordStrength.label}
                      </span>
                      {" · "}min. 6 characters
                    </p>
                  </div>
                )}
              </InputField>

              {/* Confirm password */}
              <InputField icon={Lock} label="Confirm password">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    passwordsMismatch
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                      : passwordsMatch
                        ? "border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-400"
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {passwordsMatch && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                  </p>
                )}
              </InputField>

              {/* Referral code */}
              <InputField
                icon={Gift}
                label="Referral code"
                optional
                hint="Enter a code to earn 5% on your first investment"
              >
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="e.g. APEX123456"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
                />
              </InputField>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-500 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
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

            {/* Footer links */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
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
    </div>
  );
};

export default Register;
