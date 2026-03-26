import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  X,
  FileText,
  Printer,
  DollarSign,
  BarChart3,
  History,
  Ban,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

/* ── animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/* ── tx type config ── */
const typeConfig = {
  investment: {
    label: "Investment",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    icon: Wallet,
    color: "text-blue-600 dark:text-blue-400",
  },
  withdrawal: {
    label: "Withdrawal",
    bg: "bg-red-50 dark:bg-red-900/30",
    icon: ArrowUpRight,
    color: "text-red-500 dark:text-red-400",
  },
  referral_bonus: {
    label: "Referral Bonus",
    bg: "bg-violet-50 dark:bg-violet-900/30",
    icon: Gift,
    color: "text-violet-600 dark:text-violet-400",
  },
  retrading_bonus: {
    label: "Retrading Bonus",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  bonus: {
    label: "Bonus",
    bg: "bg-violet-50 dark:bg-violet-900/30",
    icon: Gift,
    color: "text-violet-600 dark:text-violet-400",
  },
  referral: {
    label: "Referral Bonus",
    bg: "bg-violet-50 dark:bg-violet-900/30",
    icon: Gift,
    color: "text-violet-600 dark:text-violet-400",
  },
  retrading: {
    label: "Retrading Bonus",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
  },
};

const statusConfig = {
  completed: {
    label: "Completed",
    bg: "bg-emerald-50 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-800",
    Icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-200 dark:ring-amber-800",
    Icon: Clock,
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50 dark:bg-red-900/40",
    text: "text-red-600 dark:text-red-300",
    ring: "ring-red-200 dark:ring-red-800",
    Icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    ring: "ring-gray-200 dark:ring-gray-700",
    Icon: Ban,
  },
  available: {
    label: "Available",
    bg: "bg-emerald-50 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-800",
    Icon: CheckCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    ring: "ring-gray-200 dark:ring-gray-700",
    Icon: History,
  },
};

const TxStatus = ({ status }) => {
  const s = statusConfig[status] || {
    label: status,
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    ring: "ring-gray-200 dark:ring-gray-700",
    Icon: null,
  };
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

/* ═══════════════════════════════════════════════ */
const Transactions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateRange: "all",
    searchTerm: "",
  });

  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalWithdrawals: 0,
    totalReferralBonuses: 0,
    totalRetradingBonuses: 0,
    totalBonuses: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    totalVolume: 0,
    averageTransaction: 0,
  });

  const fetchTransactions = async (
    page = currentPage,
    showRefreshLoader = false,
  ) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        ...(filters.type !== "all" && { type: filters.type }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange }),
        ...(filters.searchTerm && { search: filters.searchTerm }),
      });
      const res = await axios.get(`${url}transactions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      console.log("Fetched transactions:", data.data.transactions);
      setTransactions(data.data.transactions || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
      calculateStats(data.data.transactions || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else
        setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [filters.type, filters.status, filters.dateRange]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (filters.searchTerm) fetchTransactions(1);
    }, 500);
    return () => clearTimeout(t);
  }, [filters.searchTerm]);

  const calculateStats = (data) => {
    console.log("Calculating stats for:", data);

    const investments = data.filter((t) => t.type === "investment");
    const withdrawals = data.filter((t) => t.type === "withdrawal");

    const referralBonuses = data.filter(
      (t) =>
        t.type === "referral_bonus" ||
        t.type === "referral" ||
        (t.type === "bonus" &&
          t.description?.toLowerCase().includes("referral")),
    );

    const retradingBonuses = data.filter(
      (t) =>
        t.type === "retrading_bonus" ||
        t.type === "retrading" ||
        (t.type === "bonus" &&
          t.description?.toLowerCase().includes("retrading")),
    );

    const totalInvestments = investments.reduce((s, t) => s + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((s, t) => s + t.amount, 0);
    const totalReferralBonuses = referralBonuses.reduce(
      (s, t) => s + t.amount,
      0,
    );
    const totalRetradingBonuses = retradingBonuses.reduce(
      (s, t) => s + t.amount,
      0,
    );
    const totalBonuses = totalReferralBonuses + totalRetradingBonuses;
    const totalVolume = data.reduce((s, t) => s + t.amount, 0);

    setStats({
      totalInvestments,
      totalWithdrawals,
      totalReferralBonuses,
      totalRetradingBonuses,
      totalBonuses,
      pendingTransactions: data.filter(
        (t) => t.status === "pending" || t.status === "available",
      ).length,
      completedTransactions: data.filter(
        (t) =>
          t.status === "completed" ||
          t.status === "processed" ||
          t.status === "withdrawn",
      ).length,
      totalVolume,
      averageTransaction: data.length > 0 ? totalVolume / data.length : 0,
    });
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      dateRange: "all",
      searchTerm: "",
    });
    setCurrentPage(1);
  };

  const handleExport = () => {
    const rows = transactions.map((t) => ({
      ID: t.reference || t._id.slice(-8),
      Type: t.type.replace("_", " ").toUpperCase(),
      Amount: t.amount,
      Status: t.status.toUpperCase(),
      Description: t.description || "",
      Date: new Date(t.createdAt).toLocaleDateString(),
      Reference: t.reference || "",
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const hasFilters =
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.dateRange !== "all" ||
    filters.searchTerm;

  const goPage = (p) => {
    setCurrentPage(p);
    fetchTransactions(p);
  };

  const netFlow =
    stats.totalWithdrawals + stats.totalBonuses - stats.totalInvestments;
  const isNetPositive = netFlow >= 0;

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 dark:border-blue-400/30 dark:border-t-blue-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            Loading transactions…
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
            Activity
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            All your investment, withdrawal and bonus activity
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 shrink-0"
        >
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => fetchTransactions(currentPage, true)}
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
        </motion.div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Investments",
            value: fmt(stats.totalInvestments),
            icon: Wallet,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/30",
          },
          {
            label: "Withdrawals",
            value: fmt(stats.totalWithdrawals),
            icon: ArrowUpRight,
            color: "text-red-500 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/30",
          },
          {
            label: "Bonuses",
            value: fmt(stats.totalBonuses),
            icon: Gift,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/30",
          },
          {
            label: "Net Flow (Withdrawals - Investments)",
            value: fmt(stats.totalWithdrawals - stats.totalInvestments),
            icon: BarChart3,
            color:
              stats.totalWithdrawals > stats.totalInvestments
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-orange-600 dark:text-orange-400",
            bg:
              stats.totalWithdrawals > stats.totalInvestments
                ? "bg-emerald-50 dark:bg-emerald-900/30"
                : "bg-orange-50 dark:bg-orange-900/30",
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <div
                className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-bold tracking-tight ${s.color}`}>
                {s.prefix || ""}
                {s.value}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── FILTER BAR ── */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by reference or description…"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                hasFilters
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
              {hasFilters && (
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {(filters.type !== "all" ||
          filters.status !== "all" ||
          filters.dateRange !== "all") && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            {filters.type !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[11px] font-semibold">
                {filters.type.replace("_", " ")}
                <button onClick={() => setFilters({ ...filters, type: "all" })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-semibold">
                {filters.status}
                <button
                  onClick={() => setFilters({ ...filters, status: "all" })}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-[11px] font-semibold">
                {filters.dateRange}
                <button
                  onClick={() => setFilters({ ...filters, dateRange: "all" })}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* ── TABLE ── */}
      {transactions.length > 0 ? (
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50">
                  {[
                    "Transaction",
                    "Reference",
                    "Amount",
                    "Status",
                    "Date",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((tx, i) => {
                  const tc = typeConfig[tx.type] ||
                    typeConfig[tx.type?.toLowerCase()] || {
                      label: tx.type || "Transaction",
                      bg: "bg-gray-50 dark:bg-gray-800",
                      icon: DollarSign,
                      color: "text-gray-600 dark:text-gray-400",
                    };
                  const Icon = tc.icon;
                  const isOut = tx.type === "withdrawal";
                  return (
                    <motion.tr
                      key={tx._id}
                      custom={i}
                      variants={fadeUp}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition cursor-pointer group"
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setShowDetailsModal(true);
                      }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 ${tc.bg} rounded-xl flex items-center justify-center shrink-0`}
                          >
                            <Icon className={`w-4 h-4 ${tc.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {tx.description || tc.label}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              {tc.label}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <code className="text-[11px] bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md text-gray-700 dark:text-gray-300 font-mono">
                          {tx.reference || tx._id.slice(-8)}
                        </code>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-sm font-bold ${isOut ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
                        >
                          {isOut ? "−" : "+"}
                          {fmt(tx.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <TxStatus status={tx.status} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {fmtDate(tx.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(tx);
                            setShowDetailsModal(true);
                          }}
                          className="text-xs text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-0.5 hover:gap-1.5 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition ${
                      currentPage === p
                        ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white"
                        : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center mb-6"
        >
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
            No transactions found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
            {hasFilters
              ? "Try adjusting your filters to see more results"
              : "Your transaction history will appear here"}
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* ── BOTTOM SUMMARY CARDS ── */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          {
            title: "Investment Summary",
            icon: Wallet,
            dark: "from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600",
            rows: [
              { label: "Total Invested", val: fmt(stats.totalInvestments) },
              {
                label: "Pending",
                val: stats.pendingTransactions,
              },
              { label: "Completed", val: stats.completedTransactions },
            ],
          },
          {
            title: "Bonus Summary",
            icon: Gift,
            dark: "from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600",
            rows: [
              { label: "Total Bonuses", val: fmt(stats.totalBonuses) },
              {
                label: "Referral",
                val: fmt(stats.totalReferralBonuses),
                icon: Users,
              },
              {
                label: "Retrading",
                val: fmt(stats.totalRetradingBonuses),
                icon: TrendingUp,
              },
            ],
          },
          {
            title: "Statistics",
            icon: BarChart3,
            dark: "from-violet-600 to-violet-700 dark:from-violet-500 dark:to-violet-600",
            rows: [
              { label: "Total Volume", val: fmt(stats.totalVolume) },
              { label: "Avg. Transaction", val: fmt(stats.averageTransaction) },
              { label: "Transactions", val: totalItems },
            ],
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden bg-gradient-to-br ${card.dark} rounded-2xl p-5 text-white shadow-lg`}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-white/70" />
                  <p className="text-sm font-bold">{card.title}</p>
                </div>
                <div className="space-y-2.5">
                  {card.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-white/60 flex items-center gap-1">
                        {r.icon && <r.icon className="w-3 h-3" />}
                        {r.label}
                      </span>
                      <span className="text-xs font-bold">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

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
                  Filter Transactions
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Narrow your transaction list
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
              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Transaction Type
                </p>
                <div className="space-y-1.5">
                  {[
                    { value: "all", label: "All Transactions" },
                    { value: "investment", label: "Investments" },
                    { value: "withdrawal", label: "Withdrawals" },
                    { value: "referral_bonus", label: "Referral Bonuses" },
                    { value: "retrading_bonus", label: "Retrading Bonuses" },
                    { value: "bonus", label: "Other Bonuses" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition ${
                        filters.type === opt.value
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={opt.value}
                        checked={filters.type === opt.value}
                        onChange={(e) =>
                          setFilters({ ...filters, type: e.target.value })
                        }
                        className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span
                        className={`text-sm ${filters.type === opt.value ? "font-semibold text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "all",
                    "completed",
                    "pending",
                    "available",
                    "withdrawn",
                    "failed",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilters({ ...filters, status: s })}
                      className={`py-2 rounded-xl text-xs font-semibold border capitalize transition ${
                        filters.status === s
                          ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white border-transparent shadow-sm"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
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
                    ["year", "Last 12 Mo."],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilters({ ...filters, dateRange: val })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        filters.dateRange === val
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
                  resetFilters();
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── DETAILS MODAL ── */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Transaction Details
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                  {selectedTransaction._id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* hero row */}
              {(() => {
                const tc = typeConfig[selectedTransaction.type] || {
                  label: selectedTransaction.type,
                  bg: "bg-gray-50 dark:bg-gray-800",
                  icon: DollarSign,
                  color: "text-gray-600 dark:text-gray-400",
                };
                const Icon = tc.icon;
                const isOut = selectedTransaction.type === "withdrawal";
                return (
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                    <div
                      className={`w-12 h-12 ${tc.bg} rounded-2xl flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${tc.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                        {selectedTransaction.description || tc.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {tc.label}
                      </p>
                    </div>
                    <p
                      className={`text-xl font-bold shrink-0 ${isOut ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
                    >
                      {isOut ? "−" : "+"}
                      {fmt(selectedTransaction.amount)}
                    </p>
                  </div>
                );
              })()}

              {/* detail grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    label: "Reference",
                    val: selectedTransaction.reference || "N/A",
                    mono: true,
                  },
                  {
                    label: "Type",
                    val: selectedTransaction.type.replace("_", " "),
                    mono: false,
                  },
                  {
                    label: "Created",
                    val: fmtDate(selectedTransaction.createdAt),
                    mono: false,
                  },
                  {
                    label: "Updated",
                    val: fmtDate(selectedTransaction.updatedAt),
                    mono: false,
                  },
                ].map(({ label, val, mono }) => (
                  <div
                    key={label}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3"
                  >
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p
                      className={`text-xs font-semibold text-gray-800 dark:text-gray-200 truncate ${mono ? "font-mono" : "capitalize"}`}
                    >
                      {val}
                    </p>
                  </div>
                ))}
                {/* status full-width */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 col-span-2 flex items-center justify-between">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </p>
                  <TxStatus status={selectedTransaction.status} />
                </div>
              </div>

              {/* metadata */}
              {selectedTransaction.metadata &&
                Object.keys(selectedTransaction.metadata).length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Additional Info
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-2.5">
                      {selectedTransaction.metadata.investmentId && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Investment ID
                          </span>
                          <span className="font-mono text-gray-800 dark:text-gray-200">
                            {selectedTransaction.metadata.investmentId}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.metadata.referredUser && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Referred User
                          </span>
                          <span className="font-mono text-gray-800 dark:text-gray-200">
                            {selectedTransaction.metadata.referredUser}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.metadata.bankDetails && (
                        <>
                          {[
                            [
                              "Account Name",
                              selectedTransaction.metadata.bankDetails
                                .accountName,
                            ],
                            [
                              "Account Number",
                              selectedTransaction.metadata.bankDetails
                                .accountNumber,
                            ],
                            [
                              "Bank Name",
                              selectedTransaction.metadata.bankDetails.bankName,
                            ],
                          ].map(
                            ([k, v]) =>
                              v && (
                                <div
                                  key={k}
                                  className="flex justify-between text-xs"
                                >
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {k}
                                  </span>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {v}
                                  </span>
                                </div>
                              ),
                          )}
                        </>
                      )}
                      {selectedTransaction.metadata.rate && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Rate
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {selectedTransaction.metadata.rate}%
                          </span>
                        </div>
                      )}
                      {selectedTransaction.metadata.adminNote && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Admin Note
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {selectedTransaction.metadata.adminNote}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => alert("Receipt download coming soon!")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300"
                >
                  <FileText className="w-3.5 h-3.5" /> Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
