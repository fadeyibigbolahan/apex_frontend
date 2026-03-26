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
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    completed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    failed: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${map[status?.toLowerCase()] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
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
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            Loading dashboard…
          </p>
        </div>
      </div>
    );

  /* ── error ── */
  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-10">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {error}
          </p>
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
      title: "Total Confirmed Investment",
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
      ring: "ring-blue-100 dark:ring-blue-900/30",
      icon: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      val: "text-blue-700 dark:text-blue-400",
    },
    emerald: {
      ring: "ring-emerald-100 dark:ring-emerald-900/30",
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      val: "text-emerald-700 dark:text-emerald-400",
    },
    violet: {
      ring: "ring-violet-100 dark:ring-violet-900/30",
      icon: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      val: "text-violet-700 dark:text-violet-400",
    },
    amber: {
      ring: "ring-amber-100 dark:ring-amber-900/30",
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      val: "text-amber-700 dark:text-amber-400",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {user?.referralCode || "Investor"}
            </span>{" "}
            👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
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
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
              className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 ring-1 ${a.ring} p-5 hover:shadow-md transition group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.icon}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <Link
                  to={card.link}
                  className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                {card.title}
              </p>
              <p className={`text-xl font-bold tracking-tight ${a.val}`}>
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Active Investments Section */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Active Investments
          </h2>
          <Link
            to="/investments"
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dashboardData?.investments?.active?.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.investments.active.map((inv, i) => {
              const isApex1 = inv.plan === "apex1";
              const totalPayments = isApex1 ? 2 : 3;
              const pct = (inv.withdrawals.length / totalPayments) * 100;
              return (
                <motion.div
                  key={inv._id}
                  custom={i}
                  variants={fadeUp}
                  className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 p-4 hover:border-blue-100 dark:hover:border-blue-800 hover:bg-blue-50/20 dark:hover:bg-blue-900/20 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isApex1 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}
                      >
                        {isApex1 ? (
                          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {inv.plan.toUpperCase()} Plan
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {fmt(inv.amount)} invested
                        </p>
                      </div>
                    </div>
                    <StatusPill status={inv.investmentStatus} />
                  </div>

                  {/* progress */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      <span>Payments received</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {inv.withdrawals.length}/{totalPayments}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {inv.nextWithdrawalDate
                        ? fmtDate(inv.nextWithdrawalDate)
                        : "Processing"}
                    </span>
                    {inv.nextWithdrawalDate && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {daysLeft(inv.nextWithdrawalDate)}d left
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              No active investments
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
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
    </div>
  );
};

export default Dashboard;
