// Add bank details
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  Download,
  FileText,
  Eye,
  RefreshCw,
  Wallet,
  History,
  Gift,
  Award,
  X,
  Timer,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

// Helper to get image URL from payment proof object
const getProofImageUrl = (proof) => {
  if (!proof) return "";

  // If it has a URL property, use it
  if (proof.url) return proof.url;

  // Get filename from either filename or path property
  const filename =
    proof.filename || (proof.path ? proof.path.split("/").pop() : "");

  if (!filename) return "";

  // If filename already includes http, return as is
  if (filename.startsWith("http")) return filename;

  // Construct the URL using the correct base URL (without /api)
  return `https://api.apextradingsquare.com/uploads/${filename}`;
};

// Helper to get filename from payment proof object
const getProofFilename = (proof) => {
  if (!proof) return "";
  return proof.filename || (proof.path ? proof.path.split("/").pop() : "");
};

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

/* ── Nigeria timezone helpers (UTC+1) ── */
const getNigeriaDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Date(date.getTime() + 60 * 60 * 1000);
};

// Full date with time
const formatDateFullNigeria = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    // Use built-in timezone support instead of manual offset
    return date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "N/A";
  }
};

// Date only (no time)
const formatDateShortNigeria = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

// Format time only
const formatTimeOnly = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleTimeString("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "N/A";
  }
};

// Helper to safely get Date object
const safeParseDate = (dateValue) => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/* ── status pill ── */
const InvStatus = ({ inv }) => {
  if (!inv) return null;
  if (inv.paymentStatus === "pending")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  if (inv.paymentStatus === "declined")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 ring-1 ring-red-200">
        <AlertCircle className="w-3 h-3" />
        Declined
      </span>
    );
  if (inv.investmentStatus === "active")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <TrendingUp className="w-3 h-3" />
        Active
      </span>
    );
  if (inv.investmentStatus === "completed")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
        <CheckCircle className="w-3 h-3" />
        Completed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 ring-1 ring-gray-200">
      {inv.investmentStatus}
    </span>
  );
};

const InfoTile = ({ label, value, color }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className={`text-xs font-semibold ${color || "text-gray-800"}`}>
      {value || "N/A"}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════ */
const InvestmentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [withdrawError, setWithdrawError] = useState("");

  const fetchInvestmentDetails = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${url}investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 👇 ADD THIS CONSOLE LOG HERE
      console.log("===== PAYMENT PROOF FROM API =====");
      console.log("Full investment data:", res.data.data.investment);
      console.log("Payment proof:", res.data.data.investment.paymentProof);
      console.log("Filename:", res.data.data.investment.paymentProof?.filename);
      console.log("==================================");

      setInvestment(res.data.data.investment);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 404) setError("Investment not found");
      else
        setError(
          err.response?.data?.message || "Failed to load investment details",
        );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvestmentDetails();
  }, [id]);

  useEffect(() => {
    if (investment) {
      console.log("Investment updated:", {
        withdrawals: investment.withdrawals,
        totalWithdrawn: investment.totalWithdrawn,
        investmentStatus: investment.investmentStatus,
        nextWithdrawalDate: investment.nextWithdrawalDate,
      });
    }
  }, [investment]);

  const handleWithdrawal = async () => {
    setWithdrawLoading(true);
    setWithdrawError("");
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${url}withdrawals/request`,
        {
          type: "investment",
          investmentId: id,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setWithdrawSuccess("Withdrawal request submitted successfully!");
      setShowWithdrawModal(false);
      setTimeout(() => {
        fetchInvestmentDetails(true);
        setWithdrawSuccess("");
      }, 2000);
    } catch (err) {
      console.log("withdrawing err", err);
      setWithdrawError(
        err.response?.data?.message || "Failed to process withdrawal",
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = formatDateFullNigeria;
  const fmtDateShort = formatDateShortNigeria;
  const fmtTime = formatTimeOnly;

  // ========== SAFE DATE HELPER ==========
  const getSafeDate = (dateValue) => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // ========== TIME-AWARE WORKING DAYS CALCULATION ==========
  const calculateWorkingDaysWithTime = (startDate, endDate) => {
    const start = getSafeDate(startDate);
    const end = getSafeDate(endDate);

    if (!start || !end) return 0;

    let count = 0;

    // Reset start to beginning of the day for day counting
    let startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);

    let endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    // Count working days (excluding weekends)
    let currentDay = new Date(startDay);
    while (currentDay <= endDay) {
      const dayOfWeek = currentDay.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Subtract the start day if the current time hasn't passed the start time
    if (count > 0 && end < start) {
      count--;
    }

    return count;
  };

  // ========== CALCULATE EXACT AVAILABLE DATE AND TIME ==========
  const calculateAvailableDateTime = (startDate, workingDaysRequired) => {
    const start = getSafeDate(startDate);
    if (!start) return null;

    let availableDate = new Date(start);
    let workingDaysCounted = 0;

    // Add days until we reach the required working days
    while (workingDaysCounted < workingDaysRequired) {
      availableDate.setDate(availableDate.getDate() + 1);
      const dayOfWeek = availableDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDaysCounted++;
      }
    }

    // Set the time to the same as the start time
    availableDate.setHours(start.getHours());
    availableDate.setMinutes(start.getMinutes());
    availableDate.setSeconds(start.getSeconds());

    return availableDate;
  };

  // ========== CHECK IF WITHDRAWAL IS AVAILABLE WITH TIME ==========
  const isWithdrawalAvailable = () => {
    if (!investment) return false;
    if (investment.paymentStatus !== "confirmed") return false;
    if (investment.investmentStatus !== "active") return false;

    const withdrawalsCount = investment.withdrawals?.length || 0;
    const expectedWithdrawals = investment.plan === "apex1" ? 2 : 3;

    if (withdrawalsCount >= expectedWithdrawals) return false;

    const hasPending = investment.withdrawals?.some(
      (w) => w.status === "pending",
    );
    if (hasPending) return false;

    const startDate = getSafeDate(investment.startDate);
    if (!startDate) return false;

    const currentTime = new Date();
    const phaseNumber = withdrawalsCount + 1;
    const daysRequired = phaseNumber * 5;

    const workingDaysPassed = calculateWorkingDaysWithTime(
      startDate,
      currentTime,
    );
    const availableDateTime = calculateAvailableDateTime(
      startDate,
      daysRequired,
    );

    console.log(`Phase ${phaseNumber} availability check:`, {
      startDate: startDate.toISOString(),
      currentTime: currentTime.toISOString(),
      daysRequired,
      workingDaysPassed,
      availableDateTime: availableDateTime?.toISOString(),
      isAvailable:
        workingDaysPassed >= daysRequired && currentTime >= availableDateTime,
    });

    return (
      workingDaysPassed >= daysRequired && currentTime >= availableDateTime
    );
  };

  // ========== GET NEXT WITHDRAWAL DATE WITH TIME ==========
  const getNextWithdrawalDateTime = () => {
    if (!investment) return null;
    if (investment.paymentStatus !== "confirmed") return null;
    if (investment.investmentStatus !== "active") return null;

    const withdrawalsCount = investment.withdrawals?.length || 0;
    const expectedWithdrawals = investment.plan === "apex1" ? 2 : 3;

    if (withdrawalsCount >= expectedWithdrawals) return null;

    const startDate = getSafeDate(investment.startDate);
    if (!startDate) return null;

    const phaseNumber = withdrawalsCount + 1;
    const daysRequired = phaseNumber * 5;

    return calculateAvailableDateTime(startDate, daysRequired);
  };

  // ========== GET TIME REMAINING UNTIL NEXT WITHDRAWAL ==========
  const getTimeRemaining = () => {
    const nextDate = getNextWithdrawalDateTime();
    if (!nextDate) return null;

    const now = new Date();
    const diffMs = nextDate - now;

    if (diffMs <= 0) return null;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    const remainingMinutes = Math.floor(
      (diffMs % (1000 * 60 * 60)) / (1000 * 60),
    );

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} and ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    } else {
      return `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    }
  };

  const canWithdraw = isWithdrawalAvailable();
  const nextWithdrawalDateTime = getNextWithdrawalDateTime();
  const timeRemaining = getTimeRemaining();

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">
            Loading details…
          </p>
        </div>
      </div>
    );

  if (error || !investment)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Investment Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error || "This investment doesn't exist."}
          </p>
          <Link
            to="/investments"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Investments
          </Link>
        </div>
      </div>
    );

  const isApex1 = investment.plan === "apex1";
  const totalPayments = isApex1 ? 2 : 3;
  const wd = investment.withdrawals || [];
  const wdRemaining = totalPayments - wd.length;
  const pct =
    investment.investmentStatus === "completed"
      ? 100
      : investment.paymentStatus !== "confirmed"
        ? 0
        : (wd.length / totalPayments) * 100;
  const nextAmount = investment.expectedReturn / totalPayments;
  const hasPending = wd.some((w) => w.status === "pending");

  const tabs = ["overview", "withdrawals", "timeline"];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── BACK + HEADER ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <motion.div variants={fadeUp}>
          <Link
            to="/investments"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-semibold transition mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Investments
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isApex1 ? "bg-blue-50" : "bg-emerald-50"}`}
            >
              {isApex1 ? (
                <Zap className="w-6 h-6 text-blue-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  {investment.plan.toUpperCase()} Investment
                </h1>
                <InvStatus inv={investment} />
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {investment._id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {investment.paymentProof && (
              <button
                onClick={() => setShowProofModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <Eye className="w-3.5 h-3.5" />{" "}
                <span className="hidden sm:inline">View Proof</span>
              </button>
            )}
            <button
              onClick={() => fetchInvestmentDetails(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing…" : "Refresh"}
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ── SUCCESS ── */}
      {withdrawSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          {withdrawSuccess}
        </motion.div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">
          {/* Metric cards */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              {
                label: "Invested",
                value: fmt(investment.amount),
                color: "text-gray-800",
              },
              {
                label: "Expected",
                value: fmt(investment.expectedReturn),
                color: "text-emerald-600",
              },
              {
                label: "Withdrawn",
                value: fmt(investment.totalWithdrawn),
                color: "text-blue-600",
              },
              {
                label: "Remaining",
                value: fmt(
                  investment.expectedReturn - investment.totalWithdrawn,
                ),
                color: "text-violet-600",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                  {c.label}
                </p>
                <p className={`text-base font-bold ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Progress card */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Investment Progress
            </h2>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Overall</span>
                <span className="font-semibold text-gray-700">
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isApex1 ? "bg-gradient-to-r from-blue-500 to-blue-300" : "bg-gradient-to-r from-emerald-500 to-teal-300"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                {
                  val: wd.length,
                  label: "Completed",
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
                {
                  val: wdRemaining,
                  label: "Remaining",
                  bg: "bg-amber-50",
                  color: "text-amber-600",
                },
                {
                  val: totalPayments,
                  label: "Total",
                  bg: "bg-gray-100",
                  color: "text-gray-700",
                },
                {
                  val: "5 days",
                  label: "Per Phase",
                  bg: "bg-emerald-50",
                  color: "text-emerald-600",
                },
              ].map(({ val, label, bg, color }) => (
                <div key={label} className={`${bg} rounded-xl py-3`}>
                  <p className={`text-xl font-bold ${color}`}>{val}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs card */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            {/* tab bar */}
            <div className="flex items-center gap-1 mb-5 border-b border-gray-100 pb-3">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTab === t
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {t === "withdrawals" ? "Withdrawal History" : t}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoTile
                    label="Start Date & Time"
                    value={fmtDate(
                      investment.startDate || investment.createdAt,
                    )}
                  />
                  <InfoTile
                    label="End Date"
                    value={
                      investment.endDate
                        ? fmtDate(investment.endDate)
                        : "In Progress"
                    }
                  />
                  <InfoTile
                    label="Payment Status"
                    value={investment.paymentStatus}
                  />
                  <InfoTile
                    label="Working Days"
                    value={`${investment.workingDaysPassed || 0} passed`}
                  />
                </div>

                {investment.paymentStatus === "confirmed" &&
                  investment.investmentStatus === "active" && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5">
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div>
                            <p className="text-white/70 text-xs mb-1">
                              Next Withdrawal
                            </p>
                            <p className="text-white text-2xl font-bold">
                              {fmt(nextAmount)}
                            </p>
                          </div>
                          {nextWithdrawalDateTime && (
                            <div className="text-right shrink-0">
                              <p className="text-emerald-300 text-sm font-bold">
                                {timeRemaining
                                  ? `${timeRemaining} left`
                                  : "Available Now"}
                              </p>
                            </div>
                          )}
                        </div>

                        {nextWithdrawalDateTime && (
                          <div className="flex items-center gap-2 text-white/80 text-xs">
                            <Timer className="w-3.5 h-3.5" />
                            <span>
                              Available on: {fmtDate(nextWithdrawalDateTime)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* ── WITHDRAWALS ── */}
            {activeTab === "withdrawals" && (
              <div className="space-y-3">
                {wd.length > 0 ? (
                  wd.map((w, i) => {
                    const done = w.status === "processed";
                    const pending = w.status === "pending";
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${done ? "bg-emerald-50" : pending ? "bg-amber-50" : "bg-gray-100"}`}
                        >
                          {done ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : pending ? (
                            <Clock className="w-4 h-4 text-amber-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            Phase {i + 1} Withdrawal
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {fmtDate(w.date)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-800">
                            {fmt(w.amount)}
                          </p>
                          <span
                            className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full ${done ? "bg-emerald-50 text-emerald-700" : pending ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            {w.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center py-10">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <History className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No withdrawals yet</p>
                  </div>
                )}
              </div>
            )}

            {/* ── TIMELINE ── */}
            {activeTab === "timeline" && (
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-100" />
                <div className="space-y-5">
                  {/* Created */}
                  <TimelineItem
                    color="bg-blue-500"
                    title="Investment Created"
                    date={fmtDate(investment.createdAt)}
                  />

                  {/* Confirmed */}
                  {investment.paymentStatus === "confirmed" && (
                    <TimelineItem
                      color="bg-emerald-500"
                      title="Payment Confirmed"
                      date={fmtDate(investment.startDate)}
                    />
                  )}

                  {/* Past withdrawals */}
                  {wd.map((w, i) => (
                    <TimelineItem
                      key={i}
                      color={
                        w.status === "processed"
                          ? "bg-emerald-500"
                          : w.status === "pending"
                            ? "bg-amber-400"
                            : "bg-gray-400"
                      }
                      title={`Phase ${i + 1} Withdrawal`}
                      date={fmtDate(w.date)}
                      sub={`Status: ${w.status}`}
                    />
                  ))}

                  {/* Future estimated with exact time */}
                  {investment.investmentStatus === "active" &&
                    wdRemaining > 0 &&
                    Array.from({ length: wdRemaining }).map((_, i) => {
                      const phase = wd.length + i + 1;
                      const estimatedDate = calculateAvailableDateTime(
                        investment.startDate,
                        phase * 5,
                      );
                      return (
                        <TimelineItem
                          key={`f-${i}`}
                          color="bg-gray-200"
                          title={`Phase ${phase} Withdrawal (Estimated)`}
                          date={
                            estimatedDate
                              ? fmtDate(estimatedDate)
                              : "Calculating..."
                          }
                          sub={
                            estimatedDate
                              ? `Available at ${fmtTime(estimatedDate)}`
                              : ""
                          }
                          faded
                        />
                      );
                    })}

                  {/* Completed */}
                  {investment.investmentStatus === "completed" && (
                    <TimelineItem
                      color="bg-blue-500"
                      title="Investment Completed"
                      date={fmtDate(investment.endDate)}
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Withdrawal action card */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Withdrawal
            </h2>

            {investment.paymentStatus === "confirmed" &&
            investment.investmentStatus === "active" ? (
              <>
                <div className="mb-4">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                    Available amount
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {fmt(nextAmount)}
                  </p>
                </div>

                {canWithdraw ? (
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    Request Withdrawal
                  </button>
                ) : (
                  <div>
                    <button
                      disabled
                      className="w-full py-3 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed mb-2"
                    >
                      Not Available Yet
                    </button>
                    <p className="text-[11px] text-gray-400 text-center">
                      {hasPending
                        ? "You have a pending withdrawal request"
                        : nextWithdrawalDateTime
                          ? `Available on ${fmtDate(nextWithdrawalDateTime)} at ${fmtTime(nextWithdrawalDateTime)}`
                          : "Processing withdrawal date"}
                    </p>
                    {nextWithdrawalDateTime && timeRemaining && (
                      <p className="text-[11px] text-amber-600 text-center mt-1">
                        ⏰ {timeRemaining} remaining
                      </p>
                    )}
                  </div>
                )}

                {!user?.hasBankDetails && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800">
                      Add bank details in your profile to enable withdrawals.
                    </p>
                  </div>
                )}
              </>
            ) : investment.paymentStatus === "pending" ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Awaiting Confirmation
                </p>
                <p className="text-xs text-gray-400">
                  Your investment starts once admin confirms payment.
                </p>
              </div>
            ) : investment.investmentStatus === "completed" ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Investment Completed
                </p>
                <p className="text-xs text-gray-400">
                  Total withdrawn: {fmt(investment.totalWithdrawn)}
                </p>
              </div>
            ) : null}
          </motion.div>

          {/* Summary card */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Plan Summary
            </h2>
            <div className="space-y-0">
              {[
                { label: "Plan", val: investment.plan.toUpperCase() },
                {
                  label: "Return Rate",
                  val: isApex1 ? "30%" : "50%",
                  valColor: "text-emerald-600",
                },
                {
                  label: "Duration",
                  val: isApex1 ? "10 working days" : "15 working days",
                },
                { label: "Payments", val: isApex1 ? "2 phases" : "3 phases" },
                { label: "Payment Frequency", val: "Every 5 working days" },
                {
                  label: "Withdrawal Time",
                  val: "Same as start time",
                  valColor: "text-amber-600",
                },
              ].map(({ label, val, valColor }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs text-gray-500">{label}</span>
                  <span
                    className={`text-xs font-semibold ${valColor || "text-gray-800"}`}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bonus card */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden bg-[#0b0f1a] rounded-2xl p-5"
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-8 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-4 h-4 text-violet-400" />
                <p className="text-white text-sm font-bold">
                  Bonus Opportunities
                </p>
              </div>
              <div className="space-y-3 mb-4">
                {[
                  {
                    icon: Percent,
                    label: "5% Referral Bonus",
                    sub: "Earn when friends invest via your link",
                  },
                  {
                    icon: Award,
                    label: "3% Retrading Bonus",
                    sub: "Reinvest before full payout",
                  },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">
                        {label}
                      </p>
                      <p className="text-white/40 text-[11px] mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/investments/create"
                className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs font-semibold text-center rounded-xl hover:shadow-md transition-all"
              >
                Make Another Investment
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── WITHDRAWAL MODAL ── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Confirm Withdrawal
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Phase {wd.length + 1} of {totalPayments}
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 rounded-2xl p-4 text-center mb-5">
                <p className="text-[11px] text-blue-400 uppercase tracking-wider mb-1">
                  You're about to request
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {fmt(nextAmount)}
                </p>
              </div>

              {withdrawError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                  {withdrawError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={withdrawLoading}
                  className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawal}
                  disabled={withdrawLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {withdrawLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── PAYMENT PROOF MODAL ── */}
      {showProofModal && investment.paymentProof && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Payment Proof
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Uploaded {fmtDate(investment.paymentProof.uploadedAt)}
                </p>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {(() => {
                const imageUrl = getProofImageUrl(investment.paymentProof);
                const filename = getProofFilename(investment.paymentProof);

                return filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={imageUrl}
                    alt="Payment Proof"
                    className="w-full rounded-xl border border-gray-100"
                    onError={(e) => {
                      console.error("Failed to load image:", imageUrl);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                    <FileText className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-600 mb-4">
                      {filename || "Unknown file"}
                    </p>
                    {imageUrl && (
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Download File
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ── timeline item ── */
const TimelineItem = ({ color, title, date, sub, faded }) => (
  <div className={`relative ${faded ? "opacity-40" : ""}`}>
    <div
      className={`absolute -left-4 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${color}`}
    />
    <div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  </div>
);

export default InvestmentDetails;
