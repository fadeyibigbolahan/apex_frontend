import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Download,
  X,
  BarChart3,
  Plus,
  Wallet,
  Percent,
  ChevronRight,
  Gift,
  Award,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

/* ── animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
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
  // Nigeria is UTC+1, add 1 hour for display
  return new Date(date.getTime() + 60 * 60 * 1000);
};

const formatDateNigeria = (dateString) => {
  console.log("date string", dateString);
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const nigeriaDate = new Date(date.getTime() + 60 * 60 * 1000);

    return nigeriaDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
  } catch (error) {
    return "N/A";
  }
};

/* ── status config ── */
const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-200 dark:ring-amber-800",
    Icon: Clock,
  },
  declined: {
    label: "Declined",
    bg: "bg-red-50 dark:bg-red-900/40",
    text: "text-red-600 dark:text-red-300",
    ring: "ring-red-200 dark:ring-red-800",
    Icon: XCircle,
  },
  active: {
    label: "Active",
    bg: "bg-emerald-50 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-800",
    Icon: TrendingUp,
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50 dark:bg-blue-900/40",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-200 dark:ring-blue-800",
    Icon: CheckCircle,
  },
};

const getStatus = (inv) => {
  if (inv.paymentStatus === "pending") return statusConfig.pending;
  if (inv.paymentStatus === "declined") return statusConfig.declined;
  if (inv.investmentStatus === "active") return statusConfig.active;
  if (inv.investmentStatus === "completed") return statusConfig.completed;
  return {
    label: inv.investmentStatus,
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    ring: "ring-gray-200 dark:ring-gray-700",
    Icon: null,
  };
};

const StatusPill = ({ inv }) => {
  const s = getStatus(inv);
  const Icon = s.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {s.label}
    </span>
  );
};

/* ═══════════════════════════════════════════ */
const InvestmentsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturn: 0,
    totalWithdrawn: 0,
    activeCount: 0,
    pendingCount: 0,
    completedCount: 0,
    declinedCount: 0,
    declinedAmount: 0,
  });

  const fetchInvestments = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${url}investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data.investments;
      setInvestments(data);
      calculateStats(data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else
        setError(err.response?.data?.message || "Failed to load investments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const calculateStats = (data) => {
    const s = data.reduce(
      (acc, inv) => {
        // Only include non-declined investments in totals
        if (inv.paymentStatus !== "declined") {
          acc.totalInvested += inv.amount;
          acc.totalReturn += inv.expectedReturn;
          acc.totalWithdrawn += inv.totalWithdrawn || 0;
        } else {
          // Track declined amount separately
          acc.declinedAmount += inv.amount;
        }

        // Count by status
        if (inv.paymentStatus === "pending") acc.pendingCount++;
        if (inv.paymentStatus === "declined") acc.declinedCount++;
        if (
          inv.paymentStatus === "confirmed" &&
          inv.investmentStatus === "active"
        )
          acc.activeCount++;
        if (inv.investmentStatus === "completed") acc.completedCount++;

        return acc;
      },
      {
        totalInvested: 0,
        totalReturn: 0,
        totalWithdrawn: 0,
        activeCount: 0,
        pendingCount: 0,
        completedCount: 0,
        declinedCount: 0,
        declinedAmount: 0,
      },
    );
    setStats(s);
  };

  const getFiltered = () =>
    investments.filter((inv) => {
      if (
        filter === "active" &&
        !(
          inv.paymentStatus === "confirmed" && inv.investmentStatus === "active"
        )
      )
        return false;
      if (filter === "pending" && inv.paymentStatus !== "pending") return false;
      if (filter === "completed" && inv.investmentStatus !== "completed")
        return false;
      if (filter === "declined" && inv.paymentStatus !== "declined")
        return false;
      if (selectedPlan !== "all" && inv.plan !== selectedPlan) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (
          !inv._id.toLowerCase().includes(q) &&
          !inv.plan.toLowerCase().includes(q) &&
          !inv.amount.toString().includes(q)
        )
          return false;
      }
      if (dateRange !== "all") {
        const d = new Date(inv.createdAt);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        if (dateRange === "today" && d < today) return false;
        if (dateRange === "week") {
          const w = new Date(today);
          w.setDate(w.getDate() - 7);
          if (d < w) return false;
        }
        if (dateRange === "month") {
          const m = new Date(today);
          m.setMonth(m.getMonth() - 1);
          if (d < m) return false;
        }
      }
      return true;
    });

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  // Use Nigeria formatted date
  const fmtDate = formatDateNigeria;

  const getProgress = (inv) => {
    if (inv.investmentStatus === "completed") return 100;
    if (inv.paymentStatus !== "confirmed") return 0;
    return (inv.withdrawals.length / (inv.plan === "apex1" ? 2 : 3)) * 100;
  };

  const handleExport = () => {
    const rows = getFiltered().map((inv) => ({
      ID: inv._id,
      Plan: inv.plan.toUpperCase(),
      Amount: inv.amount,
      "Expected Return": inv.expectedReturn,
      "Total Withdrawn": inv.totalWithdrawn,
      Status: inv.investmentStatus,
      "Payment Status": inv.paymentStatus,
      "Start Date": fmtDate(inv.startDate || inv.createdAt),
      "End Date": inv.endDate ? fmtDate(inv.endDate) : "-",
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `investments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredInvestments = getFiltered();

  // Calculate remaining amount and progress percentage
  const remainingAmount = stats.totalReturn - stats.totalWithdrawn;
  const progressPercentage = stats.totalReturn
    ? Math.round((stats.totalWithdrawn / stats.totalReturn) * 100)
    : 0;

  const statCards = [
    {
      label: "Total Invested",
      value: fmt(stats.totalInvested),
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      tooltip: "Total amount invested (excluding declined investments)",
    },
    {
      label: "Expected Return",
      value: fmt(stats.totalReturn),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      tooltip: "Total expected returns including profit (excluding declined)",
    },
    {
      label: "Total Withdrawn",
      value: fmt(stats.totalWithdrawn),
      icon: DollarSign,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/30",
      tooltip: "Amount already withdrawn",
    },
    {
      label: "Remaining",
      value: fmt(remainingAmount),
      icon: Gift,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      tooltip: "Amount still to be received",
    },
    {
      label: "Progress",
      value: `${progressPercentage}%`,
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      tooltip: "Percentage of total returns withdrawn",
    },
    {
      label: "Declined",
      value: fmt(stats.declinedAmount),
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/30",
      tooltip: "Total amount of declined investments",
      showIf: stats.declinedCount > 0,
    },
  ].filter((card) => card.showIf !== false);

  const tabs = [
    { key: "all", label: "All", count: investments.length },
    { key: "active", label: "Active", count: stats.activeCount },
    { key: "pending", label: "Pending", count: stats.pendingCount },
    { key: "completed", label: "Completed", count: stats.completedCount },
    { key: "declined", label: "Declined", count: stats.declinedCount },
  ];

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 dark:border-blue-400/30 dark:border-t-blue-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            Loading investments…
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── HEADER ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7"
      >
        <motion.div variants={fadeUp}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-1">
            Portfolio
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Investments
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Track and manage all your investment activity
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 shrink-0 flex-wrap"
        >
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />{" "}
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => fetchInvestments(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> New Investment
          </Link>
        </motion.div>
      </motion.div>

      {/* ── STAT CARDS (UPDATED) ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className={`grid grid-cols-2 sm:grid-cols-3 ${statCards.length > 5 ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3 mb-6`}
      >
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group relative cursor-help"
              title={s.tooltip}
            >
              <div
                className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {s.label}
              </p>
              <p className={`text-base font-bold tracking-tight ${s.color}`}>
                {s.value}
              </p>

              {/* Tooltip indicator */}
              <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  ⓘ
                </span>
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── FILTERS BAR ── */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === t.key
                  ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {t.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filter === t.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + filter icon */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className={`p-2 rounded-lg border transition ${
              selectedPlan !== "all" || dateRange !== "all"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ── ERROR ── */}
      {error && (
        <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* ── GRID ── */}
      {filteredInvestments.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredInvestments.map((inv, i) => {
            const isApex1 = inv.plan === "apex1";
            const totalPay = isApex1 ? 2 : 3;
            const pct = getProgress(inv);
            const isDeclined = inv.paymentStatus === "declined";

            return (
              <motion.div
                key={inv._id}
                custom={i}
                variants={fadeUp}
                onClick={() =>
                  !isDeclined && navigate(`/investments/${inv._id}`)
                }
                className={`bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                  !isDeclined
                    ? "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl cursor-pointer group"
                    : "opacity-75 cursor-not-allowed"
                }`}
              >
                {/* top accent line per plan */}
                <div
                  className={`h-0.5 w-full ${
                    isDeclined
                      ? "bg-gradient-to-r from-red-500 to-red-300 dark:from-red-400 dark:to-red-600"
                      : isApex1
                        ? "bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-300 dark:from-emerald-400 dark:to-teal-500"
                  }`}
                />

                <div className="p-5">
                  {/* Plan + status */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDeclined
                            ? "bg-red-50 dark:bg-red-900/30"
                            : isApex1
                              ? "bg-blue-50 dark:bg-blue-900/30"
                              : "bg-emerald-50 dark:bg-emerald-900/30"
                        }`}
                      >
                        {isDeclined ? (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : isApex1 ? (
                          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {inv.plan.toUpperCase()} Plan
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                          #{inv._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <StatusPill inv={inv} />
                  </div>

                  {/* Amounts */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                        Invested
                      </p>
                      <p
                        className={`text-xl font-bold tracking-tight ${
                          isDeclined
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {fmt(inv.amount)}
                      </p>
                    </div>
                    {!isDeclined && (
                      <div className="text-right">
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                          Expected
                        </p>
                        <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                          {fmt(inv.expectedReturn)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Show decline message for declined investments */}
                  {isDeclined && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                      <p className="text-xs text-red-700 dark:text-red-400 font-medium text-center">
                        This investment was declined and is not active
                      </p>
                    </div>
                  )}

                  {/* Progress - only show for non-declined investments */}
                  {!isDeclined && (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
                          <span>Payments received</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {inv.withdrawals.length}/{totalPay}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isApex1
                                ? "bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-600"
                                : "bg-gradient-to-r from-emerald-500 to-teal-300 dark:from-emerald-400 dark:to-teal-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2.5">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                            Start Date
                          </p>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {fmtDate(inv.startDate || inv.createdAt)}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2.5">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                            Withdrawn
                          </p>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {fmt(inv.totalWithdrawn)}
                          </p>
                        </div>
                      </div>

                      {/* Next withdrawal chip */}
                      {inv.nextWithdrawalDate &&
                        inv.investmentStatus === "active" && (
                          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-xl px-3 py-2 mb-3">
                            <span className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400">
                              <Calendar className="w-3.5 h-3.5" /> Next
                              withdrawal
                            </span>
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                              {fmtDate(inv.nextWithdrawalDate)}
                            </span>
                          </div>
                        )}
                    </>
                  )}
                </div>

                {/* Footer - only show for non-declined */}
                {!isDeclined && (
                  <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/30 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {inv.withdrawals.length} of {totalPay} withdrawals
                      complete
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center"
        >
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-7 h-7 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
            No investments found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || filter !== "all"
              ? "Try adjusting your filters"
              : "Start your investment journey today"}
          </p>
          <Link
            to="/investments/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            Make Your First Investment <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* ── FILTER MODAL ── */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Filter Investments
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Narrow down your results
                </p>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Plan */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Investment Plan
                </p>
                <div className="flex gap-2">
                  {[
                    ["all", "All Plans"],
                    ["apex1", "Apex 1"],
                    ["apex2", "Apex 2"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setSelectedPlan(val)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                        selectedPlan === val
                          ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white border-transparent shadow-sm"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Date Range
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["all", "All Time"],
                    ["today", "Today"],
                    ["week", "Last 7 Days"],
                    ["month", "Last 30 Days"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setDateRange(val)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        dateRange === val
                          ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white border-transparent shadow-sm"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => {
                  setSelectedPlan("all");
                  setDateRange("all");
                }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsList;
