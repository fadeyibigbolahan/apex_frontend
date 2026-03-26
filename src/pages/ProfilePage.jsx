// Refresh
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Copy,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X,
  Lock,
  CreditCard,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Award,
  TrendingUp,
  Wallet,
  Gift,
  LogOut,
  Camera,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

/* ── animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ── FIXED: Input with minimum font size to prevent zoom ── */
const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  hint,
  right,
}) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-3 pr-10 py-3 text-base border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        style={{ fontSize: "16px" }}
      />
      {right && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {right}
        </div>
      )}
    </div>
    {hint && (
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
        {hint}
      </p>
    )}
  </div>
);

/* ── FIXED: Select with minimum font size ── */
const Select = ({ label, value, onChange, options, placeholder, required }) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full py-3 px-3 text-base border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
      style={{ fontSize: "16px" }}
    >
      <option value="">{placeholder || "Select an option"}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/* ── info tile ── */
const InfoTile = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 w-full overflow-hidden">
    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 truncate">
      {label}
    </p>
    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
      {value || (
        <span className="text-gray-400 dark:text-gray-500 font-normal">
          Not provided
        </span>
      )}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════ */
const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [bankForm, setBankForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const fetchProfileData = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${url}users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data.user;
      setProfileData(data);
      setPersonalForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
      });
      if (data.bankDetails)
        setBankForm({
          accountName: data.bankDetails.accountName || "",
          accountNumber: data.bankDetails.accountNumber || "",
          bankName: data.bankDetails.bankName || "",
        });
      setError("");
    } catch (err) {
      if (user) {
        setProfileData(user);
        setPersonalForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "",
        });
        if (user.bankDetails)
          setBankForm({
            accountName: user.bankDetails.accountName || "",
            accountNumber: user.bankDetails.accountNumber || "",
            bankName: user.bankDetails.bankName || "",
          });
      } else {
        if (err.response?.status === 401) navigate("/login");
        else setError(err.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();

    // CRITICAL FIX: Update viewport meta tag with proper settings
    const updateViewportMeta = () => {
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "viewport";
        document.getElementsByTagName("head")[0].appendChild(meta);
      }
      meta.content =
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no";
    };

    updateViewportMeta();

    // Add global styles to prevent zoom on input focus
    const style = document.createElement("style");
    style.innerHTML = `
      /* Prevent zoom on input focus for all devices */
      input, select, textarea {
        font-size: 16px !important;
      }
      
      @media screen and (-webkit-min-device-pixel-ratio: 0) { 
        select:focus,
        textarea:focus,
        input:focus {
          font-size: 16px !important;
        }
      }
      
      /* Ensure no overflow */
      html, body {
        overflow-x: hidden;
        position: relative;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      
      #root {
        overflow-x: hidden;
        width: 100%;
        max-width: 100%;
      }
      
      /* Fix for iOS zoom */
      @supports (-webkit-touch-callout: none) {
        input, select, textarea {
          font-size: 16px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${url}users/profile`, personalForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(res.data.data.user);

      // Update auth context with any changed personal info
      updateUser({
        firstName: res.data.data.user.firstName,
        lastName: res.data.data.user.lastName,
        phoneNumber: res.data.data.user.phoneNumber,
      });

      setSuccess("Personal information updated successfully!");
      setEditingPersonal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${url}users/bank-details`, bankForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local profile data
      setProfileData(res.data.data.user);

      // UPDATE AUTH CONTEXT - Only need hasBankDetails flag
      updateUser({
        hasBankDetails: true,
      });

      setSuccess("Bank details saved successfully!");
      fetchProfileData();
      setEditingBank(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bank details");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${url}users/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=${user?.referralCode}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Never";

  const initials = () => {
    if (profileData?.firstName && profileData?.lastName)
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    return user?.email?.[0].toUpperCase() || "U";
  };

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 max-w-full">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 dark:border-blue-400/30 dark:border-t-blue-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            Loading profile…
          </p>
        </div>
      </div>
    );

  return (
    <>
      {/* CRITICAL FIX: Ensure no overflow at root level */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* ── HEADER ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 w-full"
        >
          <motion.div variants={fadeUp} className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-0.5">
              Account
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
              Manage your personal information and account settings
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 shrink-0"
          >
            <button
              onClick={() => fetchProfileData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing…" : "Refresh"}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </motion.div>
        </motion.div>

        {/* ── ALERTS ── */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2 w-full"
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2 w-full"
          >
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{error}</span>
          </motion.div>
        )}

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-4 sm:space-y-5 w-full min-w-0">
            {/* Avatar card */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800/90 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 lg:p-6 text-center w-full shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative inline-block mb-3 sm:mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-emerald-400 dark:from-blue-400 dark:to-emerald-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
                  {initials()}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight truncate">
                {profileData?.firstName || profileData?.lastName
                  ? `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim()
                  : "Complete Your Profile"}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2 sm:mb-3 truncate">
                {profileData?.email}
              </p>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[10px] sm:text-[11px] font-semibold ring-1 ring-blue-200 dark:ring-blue-800">
                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {profileData?.role === "admin"
                  ? "Administrator"
                  : "Verified Investor"}
              </span>
            </motion.div>

            {/* Referral card */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-xl sm:rounded-2xl p-4 sm:p-5 w-full shadow-xl"
            >
              <div className="absolute -top-6 -right-6 w-24 sm:w-32 h-24 sm:h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-4 sm:left-8 w-20 sm:w-24 h-20 sm:h-24 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <p className="text-white text-xs sm:text-sm font-bold truncate">
                    Your Referral Link
                  </p>
                </div>
                <div className="bg-white/8 border border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 flex items-center gap-2 mb-2 sm:mb-3 w-full">
                  <code className="text-white/60 text-[10px] sm:text-xs font-mono truncate flex-1 min-w-0">
                    {window.location.origin}/register/{user?.referralCode}
                  </code>
                  <button
                    onClick={handleCopyReferral}
                    className="relative shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition"
                  >
                    {copied ? (
                      <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                    {copied && (
                      <span className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-800 text-white text-[8px] sm:text-[10px] py-1 px-1.5 sm:px-2 rounded whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-white/40 text-[10px] sm:text-xs truncate">
                  Earn{" "}
                  <span className="text-emerald-400 font-semibold">5%</span>{" "}
                  bonus when referrals invest
                </p>
              </div>
            </motion.div>

            {/* Stats card */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800/90 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 w-full shadow-sm"
            >
              <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
                Account Statistics
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    icon: Wallet,
                    label: "Total Invested",
                    val: fmt(profileData?.totalInvested),
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-50 dark:bg-blue-900/30",
                  },
                  {
                    icon: TrendingUp,
                    label: "Total Withdrawn",
                    val: fmt(profileData?.totalWithdrawn),
                    color: "text-emerald-600 dark:text-emerald-400",
                    bg: "bg-emerald-50 dark:bg-emerald-900/30",
                  },
                  {
                    icon: Award,
                    label: "Referral Bonus",
                    val: fmt(profileData?.referralBonus),
                    color: "text-violet-600 dark:text-violet-400",
                    bg: "bg-violet-50 dark:bg-violet-900/30",
                  },
                  {
                    icon: Gift,
                    label: "Retrading Bonus",
                    val: fmt(profileData?.retradingBonus),
                    color: "text-amber-600 dark:text-amber-400",
                    bg: "bg-amber-50 dark:bg-amber-900/30",
                  },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${bg} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <Icon
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${color}`}
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                        {label}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-bold ${color} shrink-0 ml-1 sm:ml-2`}
                    >
                      {val}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700 w-full">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                      Member Since
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 shrink-0 ml-1 sm:ml-2 truncate">
                    {fmtDate(profileData?.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 w-full min-w-0">
            {/* Personal Information */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800/90 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 w-full shadow-sm"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 w-full">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide truncate">
                    Personal Information
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    Update your name and contact details
                  </p>
                </div>
                {!editingPersonal && (
                  <button
                    onClick={() => setEditingPersonal(true)}
                    className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition shrink-0 ml-1 sm:ml-2"
                  >
                    <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Edit
                  </button>
                )}
              </div>

              {editingPersonal ? (
                <form onSubmit={handlePersonalUpdate} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 w-full">
                    <Input
                      label="First Name"
                      value={personalForm.firstName}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="First name"
                    />
                    <Input
                      label="Last Name"
                      value={personalForm.lastName}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Last name"
                    />
                  </div>
                  <div className="mb-4 sm:mb-5 w-full">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={personalForm.phoneNumber}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="+234 000 000 0000"
                    />
                  </div>
                  <div className="flex justify-end gap-2 sm:gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPersonal(false);
                        setPersonalForm({
                          firstName: profileData?.firstName || "",
                          lastName: profileData?.lastName || "",
                          phoneNumber: profileData?.phoneNumber || "",
                        });
                      }}
                      className="px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
                  <InfoTile label="First Name" value={profileData?.firstName} />
                  <InfoTile label="Last Name" value={profileData?.lastName} />
                  <InfoTile label="Email Address" value={profileData?.email} />
                  <InfoTile
                    label="Phone Number"
                    value={profileData?.phoneNumber}
                  />
                </div>
              )}
            </motion.div>

            {/* Bank Details */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800/90 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 w-full shadow-sm"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 w-full">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide truncate">
                    Bank Details
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    Used for processing all withdrawals
                  </p>
                </div>
                {!editingBank &&
                  (!profileData?.bankDetails?.accountNumber ||
                    !profileData?.bankDetails?.isLocked) && (
                    <button
                      onClick={() => setEditingBank(true)}
                      className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition shrink-0 ml-1 sm:ml-2"
                    >
                      <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {profileData?.bankDetails?.accountNumber ? "Edit" : "Add"}
                    </button>
                  )}
                {profileData?.bankDetails?.isLocked &&
                  profileData?.bankDetails?.accountNumber && (
                    <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 shrink-0 ml-1 sm:ml-2">
                      <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Locked
                    </span>
                  )}
              </div>

              {editingBank ? (
                <form onSubmit={handleBankUpdate} className="w-full">
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 w-full">
                    <Input
                      label="Account Name"
                      value={bankForm.accountName}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          accountName: e.target.value,
                        })
                      }
                      placeholder="Full account name"
                      required
                    />
                    <Input
                      label="Account Number"
                      value={bankForm.accountNumber}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="10-digit account number"
                      required
                    />
                    <Input
                      label="Bank Name"
                      value={bankForm.bankName}
                      onChange={(e) =>
                        setBankForm({ ...bankForm, bankName: e.target.value })
                      }
                      placeholder="Enter your bank's full name"
                      required
                      hint="Please enter your bank's full name (e.g., Access Bank, GTBank, etc.)"
                    />
                  </div>

                  <div className="flex justify-end gap-2 sm:gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBank(false);
                        setBankForm({
                          accountName:
                            profileData?.bankDetails?.accountName || "",
                          accountNumber:
                            profileData?.bankDetails?.accountNumber || "",
                          bankName: profileData?.bankDetails?.bankName || "",
                        });
                      }}
                      className="px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Save Bank Details
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : profileData?.bankDetails?.accountNumber ? (
                <div className="space-y-2 sm:space-y-3 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
                    <InfoTile
                      label="Account Name"
                      value={profileData.bankDetails.accountName}
                    />
                    <InfoTile
                      label="Account Number"
                      value={profileData.bankDetails.accountNumber}
                    />
                    <InfoTile
                      label="Bank Name"
                      value={profileData.bankDetails.bankName}
                    />
                  </div>
                  {profileData.bankDetails.isLocked && (
                    <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 pt-1">
                      <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Locked for
                      security — contact admin to request changes
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center py-4 sm:py-6 lg:py-8 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No bank details added
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    Click "Add" above to set up your withdrawal account
                  </p>
                </div>
              )}
            </motion.div>

            {/* Security */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800/90 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 w-full shadow-sm"
            >
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 sm:mb-4">
                Security
              </h2>
              <div className="space-y-2 sm:space-y-3 w-full">
                {[
                  {
                    icon: Lock,
                    title: "Password",
                    sub: `Last changed: ${fmtDate(profileData?.passwordChangedAt)}`,
                    action: () => setShowPasswordModal(true),
                    actionLabel: "Change",
                    actionStyle:
                      "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white hover:shadow-lg",
                  },
                  {
                    icon: Shield,
                    title: "Two-Factor Authentication",
                    sub: "Add an extra layer of security",
                    action: () => {},
                    actionLabel: "Enable",
                    actionStyle:
                      "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                  },
                ].map(
                  ({
                    icon: Icon,
                    title,
                    sub,
                    action,
                    actionLabel,
                    actionStyle,
                  }) => (
                    <div
                      key={title}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg sm:rounded-xl gap-2 sm:gap-3 w-full"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm shrink-0">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {title}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {sub}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={action}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition ${actionStyle} shrink-0`}
                      >
                        {actionLabel}
                      </button>
                    </div>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                  Change Password
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  Update your account password
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition shrink-0 ml-2"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {passwordSuccess ? (
                <div className="text-center py-4 sm:py-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {passwordSuccess}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    Closing…
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="w-full">
                  {passwordError && (
                    <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-red-600 dark:text-red-400">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 w-full">
                    {[
                      {
                        key: "currentPassword",
                        label: "Current Password",
                        show: showPwd.current,
                        toggle: () =>
                          setShowPwd({ ...showPwd, current: !showPwd.current }),
                      },
                      {
                        key: "newPassword",
                        label: "New Password",
                        show: showPwd.new,
                        toggle: () =>
                          setShowPwd({ ...showPwd, new: !showPwd.new }),
                        hint: "At least 6 characters",
                      },
                      {
                        key: "confirmPassword",
                        label: "Confirm Password",
                        show: showPwd.confirm,
                        toggle: () =>
                          setShowPwd({ ...showPwd, confirm: !showPwd.confirm }),
                      },
                    ].map(({ key, label, show, toggle, hint }) => (
                      <Input
                        key={key}
                        label={label}
                        hint={hint}
                        type={show ? "text" : "password"}
                        value={passwordForm[key]}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            [key]: e.target.value,
                          })
                        }
                        placeholder={`Enter ${label.toLowerCase()}`}
                        required
                        right={
                          <button
                            type="button"
                            onClick={toggle}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                          >
                            {show ? (
                              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        }
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      disabled={changingPassword}
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordError("");
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300 disabled:opacity-40"
                    >
                      {changingPassword ? (
                        <span className="flex items-center justify-center gap-1 sm:gap-2">
                          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                          <span className="hidden sm:inline">Changing…</span>
                          <span className="sm:hidden">...</span>
                        </span>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Profile;
