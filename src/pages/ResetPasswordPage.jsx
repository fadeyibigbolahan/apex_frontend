import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { url } from "../../api";
import apex from "../assets/apex.jpeg";

// ── Input Field Component ───────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, error: fieldError, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-medium lg:text-gray-700 text-gray-300">
        {label}
      </label>
    </div>
    <div className="relative">
      <div className="absolute z-10 inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 lg:text-gray-400 text-gray-300" />
      </div>
      {children}
    </div>
    {fieldError && <p className="mt-1.5 text-xs text-red-400">{fieldError}</p>}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [validating, setValidating] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(
          `${url}auth/verify-reset-token/${token}`,
        );
        setTokenValid(true);
        setUserEmail(response.data.data.email);
      } catch (err) {
        setTokenValid(false);
        setError(
          err.response?.data?.message || "Invalid or expired reset link",
        );
      } finally {
        setValidating(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setTokenValid(false);
      setValidating(false);
      setError("No reset token provided");
    }
  }, [token]);

  // Password strength checker
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-400",
    "bg-amber-400",
    "bg-emerald-500",
    "bg-emerald-500",
  ];

  // Animated stars effect (same as Login page)
  React.useEffect(() => {
    const container = document.getElementById("reset-stars-container");
    if (!container) return;

    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 2.5 + 0.5}px;
        height: ${Math.random() * 2.5 + 0.5}px;
        background: white;
        border-radius: 50%;
        opacity: ${Math.random() * 0.7 + 0.3};
        box-shadow: 0 0 ${Math.random() * 5 + 1}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${Math.random() * 4 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        z-index: 1;
      `;
      container.appendChild(star);
    }

    for (let i = 0; i < 15; i++) {
      const orb = document.createElement("div");
      orb.className = "orb";
      const colors = ["#481B73", "#5A2A71", "#723A69", "#8A4A61"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      orb.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 150 + 50}px;
        height: ${Math.random() * 150 + 50}px;
        background: radial-gradient(circle at 30% 30%, ${color}80, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: float ${Math.random() * 20 + 20}s ease-in-out infinite;
        animation-delay: ${Math.random() * 10}s;
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

  React.useEffect(() => {
    const container = document.getElementById("mobile-reset-stars-container");
    if (!container) return;

    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 2 + 0.5}px;
        height: ${Math.random() * 2 + 0.5}px;
        background: white;
        border-radius: 50%;
        opacity: ${Math.random() * 0.6 + 0.2};
        box-shadow: 0 0 ${Math.random() * 4 + 1}px rgba(255, 255, 255, 0.8);
        animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        z-index: 1;
      `;
      container.appendChild(star);
    }

    for (let i = 0; i < 8; i++) {
      const orb = document.createElement("div");
      orb.className = "orb";
      const colors = ["#481B73", "#5A2A71", "#723A69"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      orb.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 100 + 30}px;
        height: ${Math.random() * 100 + 30}px;
        background: radial-gradient(circle at 30% 30%, ${color}60, transparent 70%);
        border-radius: 50%;
        filter: blur(30px);
        animation: float ${Math.random() * 15 + 15}s ease-in-out infinite;
        animation-delay: ${Math.random() * 10}s;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${url}auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xl font-bold">!</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 transition"
          >
            Request New Link <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full relative"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        .serif{font-family:'DM Serif Display',Georgia,serif;}
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
        }
        input, select, textarea { font-size: 16px !important; }
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
        .desktop-input::placeholder { color: #9ca3af; }
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
        .mobile-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .mobile-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(147, 51, 234, 0.6);
          outline: none;
        }
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
        #reset-stars-container, #mobile-reset-stars-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
      `}</style>

      {/* Desktop Left Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
            zIndex: 0,
          }}
        />
        <div id="reset-stars-container" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%)",
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
            Reset password
          </p>
          <h2 className="serif text-5xl text-white leading-[1.1] mb-5">
            Create new
            <br />
            password<em className="not-italic text-purple-300">.</em>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Choose a strong password to secure your account and investments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10"
        >
          <div className="glass-card rounded-xl px-5 py-4">
            <p className="text-purple-300 text-sm font-semibold mb-2">
              Password Requirements
            </p>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>At least 6 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include numbers and special characters for extra security</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div
        className="flex-1 flex flex-col lg:bg-white overflow-y-auto relative"
        style={{ zIndex: 10 }}
      >
        {/* Mobile version */}
        <div className="lg:hidden relative min-h-screen">
          <div
            className="fixed inset-0 w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
              zIndex: 0,
            }}
          />
          <div id="mobile-reset-stars-container" className="fixed inset-0" />
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
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center p-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm"
            >
              {!success ? (
                <>
                  <div className="mb-7">
                    <h1 className="serif text-3xl text-white mb-1.5">
                      Set new password
                    </h1>
                    <p className="text-sm text-gray-300">
                      For account:{" "}
                      <span className="text-purple-300">{userEmail}</span>
                    </p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 flex items-center gap-2.5 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3"
                      >
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            !
                          </span>
                        </div>
                        <p className="text-sm text-red-200">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField icon={Lock} label="New Password">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="••••••••"
                          required
                          className="input-base mobile-input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </InputField>

                    {password && (
                      <div className="mt-1">
                        <div className="flex gap-1 h-1.5 mb-1">
                          <div
                            className={`flex-1 rounded-full ${strengthColors[passwordStrength - 1] || "bg-gray-200"}`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          Strength:{" "}
                          <span
                            className={
                              passwordStrength > 0
                                ? `text-${passwordStrength >= 3 ? "emerald-400" : "amber-400"}`
                                : "text-gray-400"
                            }
                          >
                            {strengthLabels[passwordStrength - 1] || "Weak"}
                          </span>
                        </p>
                      </div>
                    )}

                    <InputField icon={Lock} label="Confirm Password">
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="••••••••"
                          required
                          className="input-base mobile-input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </InputField>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Resetting...
                        </>
                      ) : (
                        <>
                          Reset Password <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-gray-300">
                    <Link
                      to="/login"
                      className="text-purple-300 hover:text-purple-200 font-semibold"
                    >
                      Back to sign in
                    </Link>
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="serif text-2xl text-white mb-2">
                    Password Reset!
                  </h2>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    {success}
                  </p>
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </motion.div>
              )}
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
              {!success ? (
                <>
                  <div className="mb-7">
                    <h1 className="serif text-3xl text-gray-900 mb-1.5">
                      Set new password
                    </h1>
                    <p className="text-sm text-gray-500">
                      For account:{" "}
                      <span className="text-purple-600 font-medium">
                        {userEmail}
                      </span>
                    </p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                      >
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            !
                          </span>
                        </div>
                        <p className="text-sm text-red-700">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField icon={Lock} label="New Password">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="••••••••"
                          required
                          className="input-base desktop-input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </InputField>

                    {password && (
                      <div className="mt-1">
                        <div className="flex gap-1 h-1.5 mb-1">
                          <div
                            className={`flex-1 rounded-full ${strengthColors[passwordStrength - 1] || "bg-gray-200"}`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Strength:{" "}
                          <span
                            className={
                              passwordStrength > 0
                                ? `font-semibold ${passwordStrength >= 3 ? "text-emerald-600" : "text-amber-600"}`
                                : "text-gray-500"
                            }
                          >
                            {strengthLabels[passwordStrength - 1] || "Weak"}
                          </span>
                        </p>
                      </div>
                    )}

                    <InputField icon={Lock} label="Confirm Password">
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="••••••••"
                          required
                          className="input-base desktop-input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </InputField>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Resetting...
                        </>
                      ) : (
                        <>
                          Reset Password <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-semibold transition"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to sign in
                    </Link>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="serif text-2xl text-gray-900 mb-2">
                    Password Reset!
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                    {success}
                  </p>
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
