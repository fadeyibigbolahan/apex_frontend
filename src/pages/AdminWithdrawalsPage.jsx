import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  X,
  Calendar,
  Banknote,
  History,
  Ban,
  ChevronLeft,
  ChevronRight,
  Printer,
  FileText,
  TrendingUp,
  Gift,
  Shield,
  User,
  Check,
  ThumbsUp,
  ThumbsDown,
  Loader,
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

/* ── status config ── */
const statusConfig = {
  processed: {
    label: "Processed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    Icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    Icon: Clock,
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50",
    text: "text-red-600",
    ring: "ring-red-200",
    Icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-gray-100",
    text: "text-gray-500",
    ring: "ring-gray-200",
    Icon: Ban,
  },
};

const StatusBadge = ({ status }) => {
  const s = statusConfig[status] || {
    label: status,
    bg: "bg-gray-100",
    text: "text-gray-500",
    ring: "ring-gray-200",
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

const AdminWithdrawals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [processSuccess, setProcessSuccess] = useState("");
  const [processError, setProcessError] = useState("");
  const [processAction, setProcessAction] = useState("approve"); // 'approve' or 'reject'
  const [rejectReason, setRejectReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    searchTerm: "",
  });

  const [stats, setStats] = useState({
    totalWithdrawals: 0,
    totalAmount: 0,
    pending: 0,
    pendingAmount: 0,
    processed: 0,
    processedAmount: 0,
    failed: 0,
  });

  const fetchWithdrawals = async (
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
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange }),
        ...(filters.searchTerm && { search: filters.searchTerm }),
      });
      const res = await axios.get(`${url}admin/withdrawals?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      console.log("Fetched withdrawals:", data);
      setWithdrawals(data.data.withdrawals || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
      calculateStats(data.data.withdrawals || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 403) navigate("/dashboard");
      else
        setError(err.response?.data?.message || "Failed to load withdrawals");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(1);
  }, [filters.status, filters.dateRange]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (filters.searchTerm) fetchWithdrawals(1);
    }, 500);
    return () => clearTimeout(t);
  }, [filters.searchTerm]);

  const calculateStats = (data) => {
    const pending = data.filter((w) => w.status === "pending");
    const processed = data.filter((w) => w.status === "processed");
    const failed = data.filter(
      (w) => w.status === "failed" || w.status === "cancelled",
    );

    setStats({
      totalWithdrawals: data.length,
      totalAmount: data.reduce((s, w) => s + w.amount, 0),
      pending: pending.length,
      pendingAmount: pending.reduce((s, w) => s + w.amount, 0),
      processed: processed.length,
      processedAmount: processed.reduce((s, w) => s + w.amount, 0),
      failed: failed.length,
    });
  };

  const handleProcessWithdrawal = async () => {
    setProcessLoading(true);
    setProcessError("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        status: processAction === "approve" ? "processed" : "failed",
        ...(processAction === "reject" && {
          reason: rejectReason || "Withdrawal rejected",
        }),
      };

      await axios.post(
        `${url}admin/withdrawals/${selectedWithdrawal._id}/process`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setProcessSuccess(
        `Withdrawal ${processAction === "approve" ? "approved" : "rejected"} successfully!`,
      );

      setTimeout(() => {
        fetchWithdrawals(currentPage);
        setShowProcessModal(false);
        setProcessSuccess("");
        setSelectedWithdrawal(null);
        setRejectReason("");
      }, 2000);
    } catch (err) {
      setProcessError(
        err.response?.data?.message || "Failed to process withdrawal",
      );
    } finally {
      setProcessLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ status: "all", dateRange: "all", searchTerm: "" });
    setCurrentPage(1);
  };

  const handleExport = () => {
    const rows = withdrawals.map((w) => ({
      ID: w.reference || w._id.slice(-8),
      User: w.user?.email || "Unknown",
      Amount: w.amount,
      Type: w.type || "Investment",
      Status: w.status,
      "Requested Date": new Date(w.createdAt).toLocaleDateString(),
      "Processed Date": w.processedAt
        ? new Date(w.processedAt).toLocaleDateString()
        : "N/A",
      Reference: w.reference || "",
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `admin-withdrawals-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
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
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const hasFilters =
    filters.status !== "all" ||
    filters.dateRange !== "all" ||
    filters.searchTerm;

  const goPage = (p) => {
    setCurrentPage(p);
    fetchWithdrawals(p);
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">
            Loading withdrawals…
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── HEADER ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7"
      >
        <motion.div variants={fadeUp}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Admin
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Withdrawal Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and process user withdrawal requests
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 flex-wrap shrink-0"
        >
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => fetchWithdrawals(currentPage, true)}
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
        </motion.div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Total Withdrawals",
            value: stats.totalWithdrawals,
            subValue: fmt(stats.totalAmount),
            icon: Wallet,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending",
            value: stats.pending,
            subValue: fmt(stats.pendingAmount),
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Processed",
            value: stats.processed,
            subValue: fmt(stats.processedAmount),
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Failed",
            value: stats.failed,
            icon: AlertCircle,
            color: "text-red-600",
            bg: "bg-red-50",
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition"
            >
              <div
                className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-bold tracking-tight ${s.color}`}>
                {s.value}
              </p>
              {s.subValue && (
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  {s.subValue}
                </p>
              )}
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── PENDING BANNER ── */}
      {stats.pending > 0 && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">
                {stats.pending} Pending Withdrawal{stats.pending > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-amber-600">
                Total amount: {fmt(stats.pendingAmount)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilters({ ...filters, status: "pending" })}
            className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition"
          >
            View Pending
          </button>
        </motion.div>
      )}

      {/* ── FILTER BAR ── */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user email or ID…"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                hasFilters
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
              {hasFilters && (
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </button>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-400 hover:text-gray-700 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {(filters.status !== "all" || filters.dateRange !== "all") && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
            {filters.status !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold">
                Status: {filters.status}
                <button
                  onClick={() => setFilters({ ...filters, status: "all" })}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-[11px] font-semibold">
                Date: {filters.dateRange}
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
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {/* ── TABLE ── */}
      {withdrawals.length > 0 ? (
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {[
                    "User",
                    "Type",
                    "Amount",
                    "Status",
                    "Requested",
                    "Processed",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((wd, i) => (
                  <motion.tr
                    key={wd._id}
                    custom={i}
                    variants={fadeUp}
                    className="hover:bg-gray-50/60 transition"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {wd.user?.email?.[0] || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {wd.user?.email || "Unknown User"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ID: {wd.user?._id?.slice(-8) || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${
                          wd.type === "bonus"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {wd.type === "bonus" ? (
                          <Gift className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        {wd.type === "bonus" ? "Bonus" : "Investment"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        {fmt(wd.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={wd.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {fmtDate(wd.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {wd.processedAt ? fmtDate(wd.processedAt) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedWithdrawal(wd);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {wd.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(wd);
                                setProcessAction("approve");
                                setShowProcessModal(true);
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Approve"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(wd);
                                setProcessAction("reject");
                                setShowProcessModal(true);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Reject"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 p-16 text-center mb-6"
        >
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">
            No withdrawals found
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            {hasFilters
              ? "Try adjusting your filters"
              : "No withdrawal requests have been submitted yet"}
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* ── FILTER MODAL ── */}
      {showFilterModal && (
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
                  Filter Withdrawals
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Narrow your withdrawal list
                </p>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["all", "pending", "processed", "failed", "cancelled"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setFilters({ ...filters, status: s })}
                        className={`py-2 rounded-xl text-xs font-semibold border capitalize transition ${
                          filters.status === s
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {s === "all" ? "All" : s}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
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
                className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── DETAILS MODAL ── */}
      {showDetailsModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Withdrawal Details
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  {selectedWithdrawal._id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* hero row */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    selectedWithdrawal.type === "bonus"
                      ? "bg-violet-50"
                      : "bg-blue-50"
                  }`}
                >
                  {selectedWithdrawal.type === "bonus" ? (
                    <Gift className="w-5 h-5 text-violet-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">
                    {selectedWithdrawal.type === "bonus"
                      ? "Bonus Withdrawal"
                      : "Investment Withdrawal"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedWithdrawal.type === "bonus"
                      ? "From bonuses"
                      : `Phase ${selectedWithdrawal.phase || "?"}`}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 shrink-0">
                  {fmt(selectedWithdrawal.amount)}
                </p>
              </div>

              {/* detail tiles */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    label: "Reference",
                    val: selectedWithdrawal.reference || "N/A",
                    mono: true,
                  },
                  {
                    label: "Type",
                    val: selectedWithdrawal.type || "Investment",
                    mono: false,
                  },
                  {
                    label: "Requested",
                    val: fmtDate(selectedWithdrawal.createdAt),
                    mono: false,
                  },
                  {
                    label: "Processed",
                    val: selectedWithdrawal.processedAt
                      ? fmtDate(selectedWithdrawal.processedAt)
                      : "Not yet",
                    mono: false,
                  },
                ].map(({ label, val, mono }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p
                      className={`text-xs font-semibold text-gray-800 truncate ${mono ? "font-mono" : "capitalize"}`}
                    >
                      {val}
                    </p>
                  </div>
                ))}
                <div className="bg-gray-50 rounded-xl p-3 col-span-2 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Status
                  </p>
                  <StatusBadge status={selectedWithdrawal.status} />
                </div>
              </div>

              {/* bank details */}
              {selectedWithdrawal.metadata?.bankDetails && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Bank Details
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                    {[
                      [
                        "Account Name",
                        selectedWithdrawal.metadata.bankDetails.accountName,
                      ],
                      [
                        "Account Number",
                        selectedWithdrawal.metadata.bankDetails.accountNumber,
                      ],
                      [
                        "Bank Name",
                        selectedWithdrawal.metadata.bankDetails.bankName,
                      ],
                    ].map(
                      ([k, v]) =>
                        v && (
                          <div key={k} className="flex justify-between text-xs">
                            <span className="text-gray-500">{k}</span>
                            <span className="font-semibold text-gray-800">
                              {v}
                            </span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}

              {/* admin note */}
              {selectedWithdrawal.metadata?.adminNote && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Admin Note
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700">
                    {selectedWithdrawal.metadata.adminNote}
                  </div>
                </div>
              )}

              {/* actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => alert("Receipt download coming soon!")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <FileText className="w-3.5 h-3.5" /> Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── PROCESS MODAL ── */}
      {showProcessModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {processAction === "approve" ? "Approve" : "Reject"}{" "}
                  Withdrawal
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {processAction === "approve"
                    ? "Confirm to approve this withdrawal"
                    : "Provide a reason for rejection"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProcessModal(false);
                  setProcessError("");
                  setProcessSuccess("");
                  setRejectReason("");
                }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {processSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {processSuccess}
                  </p>
                  <p className="text-xs text-gray-400">Refreshing list…</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-lg font-bold text-gray-900">
                        {fmt(selectedWithdrawal.amount)}
                      </span>
                    </div>

                    {processAction === "reject" && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Reason for rejection
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter reason (optional)"
                          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                          rows="3"
                        />
                      </div>
                    )}
                  </div>

                  {processError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                      {processError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowProcessModal(false);
                        setProcessError("");
                        setRejectReason("");
                      }}
                      disabled={processLoading}
                      className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProcessWithdrawal}
                      disabled={processLoading}
                      className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center ${
                        processAction === "approve"
                          ? "bg-gradient-to-r from-emerald-500 to-green-500"
                          : "bg-gradient-to-r from-red-500 to-rose-500"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {processLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          Processing…
                        </span>
                      ) : processAction === "approve" ? (
                        "Approve"
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
