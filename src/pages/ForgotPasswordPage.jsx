import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, ArrowRight, ArrowLeft, X } from "lucide-react";
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
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Animated stars and light effect for desktop left panel
  React.useEffect(() => {
    const container = document.getElementById("forgot-stars-container");
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

  // Mobile stars effect
  React.useEffect(() => {
    const container = document.getElementById("mobile-forgot-stars-container");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${url}auth/forgot-password`, { email });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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

        #forgot-stars-container, #mobile-forgot-stars-container {
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

        <div id="forgot-stars-container" />

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
            Reset password
          </p>
          <h2 className="serif text-5xl text-white leading-[1.1] mb-5">
            Forgot your
            <br />
            password?{" "}
            <em className="not-italic text-purple-300">No worries.</em>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Enter your email and we'll send you instructions to reset your
            password and get back to your investments.
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
              Security Tip
            </p>
            <p className="text-gray-300 text-xs leading-relaxed">
              The reset link will expire in 10 minutes for your security. If you
              don't receive the email, check your spam folder.
            </p>
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

          <div id="mobile-forgot-stars-container" className="fixed inset-0" />

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
              to="/login"
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center p-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm"
            >
              {!submitted ? (
                <>
                  <div className="mb-7">
                    <h1 className="serif text-3xl text-white mb-1.5">
                      Forgot password?
                    </h1>
                    <p className="text-sm text-gray-300">
                      Enter your email to reset your password
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
                          <span className="text-white text-xs font-bold leading-none">
                            !
                          </span>
                        </div>
                        <p className="text-sm text-red-200">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField icon={Mail} label="Email address">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="input-base mobile-input"
                      />
                    </InputField>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        <>
                          Send reset instructions{" "}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-gray-300">
                    Remember your password?{" "}
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
                    Check your inbox
                  </h2>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    We've sent password reset instructions to{" "}
                    <span className="text-purple-300 font-medium">{email}</span>
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    The link will expire in 10 minutes.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Back to sign in <ArrowRight className="w-4 h-4" />
                  </Link>
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
              {!submitted ? (
                <>
                  <div className="mb-7">
                    <h1 className="serif text-3xl text-gray-900 mb-1.5">
                      Forgot password?
                    </h1>
                    <p className="text-sm text-gray-500">
                      Enter your email to reset your password
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
                          <span className="text-white text-xs font-bold leading-none">
                            !
                          </span>
                        </div>
                        <p className="text-sm text-red-700">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField icon={Mail} label="Email address">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="input-base desktop-input"
                      />
                    </InputField>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        <>
                          Send reset instructions{" "}
                          <ArrowRight className="w-4 h-4" />
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
                    Check your inbox
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                    We've sent password reset instructions to{" "}
                    <span className="text-purple-600 font-medium">{email}</span>
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    The link will expire in 10 minutes.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Back to sign in <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
