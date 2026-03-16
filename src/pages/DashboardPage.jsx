import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Users,
  Gift,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  Zap,
  Download,
  Calendar,
  DollarSign,
  Percent,
  BarChart3,
  RefreshCw,
  Lock,
  Plus,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── tiny helpers ─── */
const StatusPill = ({ status }) => {
  const map = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-600",
    failed: "bg-red-100 text-red-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${map[status?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

/* ═══════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);

  const fetchDashboardData = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${url}users/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else
        setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      maximumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const daysLeft = (d) => {
    if (!d) return 0;
    const diff = Math.ceil((new Date(d) - new Date()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  const bonusReferral =
    dashboardData?.bonuses?.find((b) => b._id === "referral")?.available || 0;
  const bonusRetrading =
    dashboardData?.bonuses?.find((b) => b._id === "retrading")?.available || 0;
  const totalBonus = bonusReferral + bonusRetrading;

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-500 tracking-wide">
            Loading dashboard…
          </p>
        </div>
      </div>
    );

  /* ── error ── */
  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const summaryCards = [
    {
      title: "Total Invested",
      value: fmt(dashboardData?.user?.totalInvested),
      icon: Wallet,
      accent: "blue",
      link: "/investments",
    },
    {
      title: "Total Withdrawn",
      value: fmt(dashboardData?.user?.totalWithdrawn),
      icon: DollarSign,
      accent: "emerald",
      link: "/withdrawals",
    },
    {
      title: "Active Investments",
      value: dashboardData?.investments?.counts?.active || 0,
      icon: TrendingUp,
      accent: "violet",
      link: "/investments",
    },
    {
      title: "Available Bonuses",
      value: fmt(totalBonus),
      icon: Gift,
      accent: "amber",
      link: "/bonuses",
    },
  ];

  const accentMap = {
    blue: {
      ring: "ring-blue-100",
      icon: "bg-blue-50 text-blue-600",
      val: "text-blue-700",
    },
    emerald: {
      ring: "ring-emerald-100",
      icon: "bg-emerald-50 text-emerald-600",
      val: "text-emerald-700",
    },
    violet: {
      ring: "ring-violet-100",
      icon: "bg-violet-50 text-violet-600",
      val: "text-violet-700",
    },
    amber: {
      ring: "ring-amber-100",
      icon: "bg-amber-50 text-amber-600",
      val: "text-amber-700",
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── HEADER ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <motion.div variants={fadeUp}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Welcome back,{" "}
            <span className="text-blue-600">
              {user?.firstName || "Investor"}
            </span>{" "}
            👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's your portfolio snapshot for today.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 shrink-0"
        >
          <button
            onClick={() => fetchDashboardData(true)}
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
          <Link
            to="/investments/create"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Investment
          </Link>
        </motion.div>
      </motion.div>

      {/* ── SUMMARY CARDS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          const a = accentMap[card.accent];
          return (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              className={`bg-white rounded-2xl border border-gray-100 ring-1 ${a.ring} p-5 hover:shadow-md transition group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.icon}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <Link
                  to={card.link}
                  className="text-gray-300 group-hover:text-gray-500 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-gray-500 mb-1 font-medium">
                {card.title}
              </p>
              <p className={`text-xl font-bold tracking-tight ${a.val}`}>
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── REFERRAL BANNER ── */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden bg-[#0b0f1a] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        {/* decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 right-20 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              Refer & Earn <span className="text-emerald-400">5%</span>
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              Share your link — earn when friends invest
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="bg-white/8 border border-white/10 px-3 py-2 rounded-lg max-w-[240px] overflow-hidden">
            <code className="text-white/70 text-xs font-mono truncate block">
              {window.location.origin}/r/{user?.referralCode}
            </code>
          </div>
          <button
            onClick={handleCopyReferral}
            className="relative shrink-0 w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg flex items-center justify-center text-white transition"
          >
            <Copy className="w-4 h-4" />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Active Investments + Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Investments */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Active Investments
              </h2>
              <Link
                to="/investments"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {dashboardData?.investments?.active?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.investments.active.slice(0, 3).map((inv, i) => {
                  const isApex1 = inv.plan === "apex1";
                  const totalPayments = isApex1 ? 2 : 3;
                  const pct = (inv.withdrawals.length / totalPayments) * 100;
                  return (
                    <motion.div
                      key={inv._id}
                      custom={i}
                      variants={fadeUp}
                      className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 hover:border-blue-100 hover:bg-blue-50/20 transition"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isApex1 ? "bg-blue-100" : "bg-emerald-100"}`}
                          >
                            {isApex1 ? (
                              <Zap className="w-4 h-4 text-blue-600" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {inv.plan.toUpperCase()} Plan
                            </p>
                            <p className="text-xs text-gray-500">
                              {fmt(inv.amount)} invested
                            </p>
                          </div>
                        </div>
                        <StatusPill status={inv.investmentStatus} />
                      </div>

                      {/* progress */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>Payments received</span>
                          <span className="font-semibold text-gray-700">
                            {inv.withdrawals.length}/{totalPayments}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {inv.nextWithdrawalDate
                            ? fmtDate(inv.nextWithdrawalDate)
                            : "Processing"}
                        </span>
                        {inv.nextWithdrawalDate && (
                          <span className="font-semibold text-emerald-600">
                            {daysLeft(inv.nextWithdrawalDate)}d left
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {dashboardData.investments.active.length > 3 && (
                  <Link
                    to="/investments"
                    className="block text-center text-xs text-blue-600 hover:text-blue-700 font-semibold py-2"
                  >
                    +{dashboardData.investments.active.length - 3} more
                    investments
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  No active investments
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Start your investment journey today
                </p>
                <Link
                  to="/investments/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Make First Investment <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Recent Transactions
              </h2>
              <Link
                to="/transactions"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {dashboardData?.transactions?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {dashboardData.transactions.map((tx) => {
                  const isWithdrawal = tx.type === "withdrawal";
                  const isBonus = tx.type.includes("bonus");
                  const iconBg = isWithdrawal
                    ? "bg-red-50 text-red-500"
                    : isBonus
                      ? "bg-violet-50 text-violet-600"
                      : "bg-blue-50 text-blue-600";
                  const Icon = isWithdrawal
                    ? DollarSign
                    : isBonus
                      ? Gift
                      : Wallet;
                  return (
                    <div
                      key={tx._id}
                      className="flex items-center gap-3 py-3 hover:bg-gray-50/60 rounded-lg px-1 transition"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {tx.description ||
                            tx.type.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {fmtDate(tx.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm font-bold ${isWithdrawal ? "text-red-500" : "text-emerald-600"}`}
                        >
                          {isWithdrawal ? "−" : "+"}
                          {fmt(tx.amount)}
                        </p>
                        <StatusPill status={tx.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No transactions yet
              </p>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Bank Details */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Bank Details
            </h2>

            {dashboardData?.user?.hasBankDetails ? (
              <div className="space-y-2.5">
                {[
                  {
                    label: "Account Name",
                    val: dashboardData.user.bankDetails?.accountName,
                  },
                  {
                    label: "Account Number",
                    val: dashboardData.user.bankDetails?.accountNumber,
                  },
                  {
                    label: "Bank Name",
                    val: dashboardData.user.bankDetails?.bankName,
                  },
                ].map(({ label, val }) => (
                  <div key={label} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{val}</p>
                  </div>
                ))}
                <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                  <Lock className="w-3 h-3" /> Locked for security
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-5">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Add your bank details to enable withdrawals
                </p>
                <Link
                  to="/profile"
                  className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  Add Bank Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Bonus Summary */}
          <motion.div
            custom={8}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Your Bonuses
              </h2>
              <Link
                to="/bonuses"
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700"
              >
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Referral
                    </p>
                    <p className="text-[10px] text-gray-400">Available</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-blue-600">
                  {fmt(bonusReferral)}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Retrading
                    </p>
                    <p className="text-[10px] text-gray-400">Available</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-violet-600">
                  {fmt(bonusRetrading)}
                </p>
              </div>
            </div>

            {/* progress to min withdrawal */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Min. withdrawal</span>
                <span className="font-semibold text-gray-700">₦10,000</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((totalBonus / 10000) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowBonusModal(true)}
              disabled={totalBonus < 10000}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Withdraw Bonuses
            </button>
          </motion.div>

          {/* Tips card */}
          <motion.div
            custom={9}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden bg-[#0b0f1a] rounded-2xl p-5 text-white"
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/15 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <p className="text-sm font-bold">Quick Tips</p>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Get 3% bonus when you reinvest before full payout",
                  "Share your referral link to earn 5% on friends' investments",
                  "Withdrawals are available every 5 working days",
                ].map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-white/60 leading-relaxed"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BONUS MODAL ── */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Withdraw Bonuses
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Review your available balance
              </p>
            </div>

            <div className="p-6 space-y-3">
              {[
                {
                  label: "Referral Bonus",
                  val: fmt(bonusReferral),
                  color: "text-blue-600",
                },
                {
                  label: "Retrading Bonus",
                  val: fmt(bonusRetrading),
                  color: "text-violet-600",
                },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`text-sm font-bold ${color}`}>{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-900">
                  Total Available
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {fmt(totalBonus)}
                </span>
              </div>
            </div>

            {!dashboardData?.user?.hasBankDetails && (
              <div className="mx-6 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Please add bank details in your profile before withdrawing.
                </p>
              </div>
            )}

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowBonusModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={
                  !dashboardData?.user?.hasBankDetails || totalBonus < 10000
                }
                onClick={() => {
                  setShowBonusModal(false);
                  navigate("/bonuses");
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Withdraw
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
