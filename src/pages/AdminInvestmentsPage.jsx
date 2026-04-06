import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  X,
  Calendar,
  DollarSign,
  Users,
  Zap,
  Award,
  FileText,
  Image,
  Download as DownloadIcon,
  Check,
  Ban,
  Loader,
  ChevronRight,
  MoreVertical,
  Shield,
  Gift,
  Percent,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronDown,
  SlidersHorizontal,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

const AdminInvestments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    investment: null,
    type: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    plan: "all",
    dateRange: "all",
    searchTerm: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    pending: 0,
    pendingAmount: 0,
    confirmed: 0,
    confirmedAmount: 0,
    declined: 0,
    declinedAmount: 0,
    active: 0,
    activeAmount: 0,
    completed: 0,
    completedAmount: 0,
    apex1: 0,
    apex1Amount: 0,
    apex2: 0,
    apex2Amount: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("filter") === "pending") {
      setFilters((prev) => ({ ...prev, status: "pending" }));
    }
    if (params.get("filter") === "declined") {
      setFilters((prev) => ({ ...prev, status: "declined" }));
    }
  }, [location]);

  const fetchInvestments = async (
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
        ...(filters.plan !== "all" && { plan: filters.plan }),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange }),
        ...(filters.searchTerm && { search: filters.searchTerm }),
      });
      const response = await axios.get(`${url}admin/investments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setInvestments(data.data.investments || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
      calculateStats(data.data.investments || [], data.data.stats);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 403) navigate("/dashboard");
      else
        setError(err.response?.data?.message || "Failed to load investments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvestments(1);
  }, [filters.status, filters.plan, filters.dateRange]);

  const calculateStats = (investmentsData, statsData) => {
    if (statsData) {
      setStats(statsData);
      return;
    }
    const pending = investmentsData.filter(
      (i) => i.paymentStatus === "pending",
    );
    const confirmed = investmentsData.filter(
      (i) => i.paymentStatus === "confirmed",
    );
    const declined = investmentsData.filter(
      (i) => i.paymentStatus === "declined",
    );
    const active = investmentsData.filter(
      (i) => i.investmentStatus === "active",
    );
    const completed = investmentsData.filter(
      (i) => i.investmentStatus === "completed",
    );
    const apex1 = investmentsData.filter((i) => i.plan === "apex1");
    const apex2 = investmentsData.filter((i) => i.plan === "apex2");
    setStats({
      total: investmentsData.length,
      totalAmount: investmentsData.reduce((s, i) => s + i.amount, 0),
      pending: pending.length,
      pendingAmount: pending.reduce((s, i) => s + i.amount, 0),
      confirmed: confirmed.length,
      confirmedAmount: confirmed.reduce((s, i) => s + i.amount, 0),
      declined: declined.length,
      declinedAmount: declined.reduce((s, i) => s + i.amount, 0),
      active: active.length,
      activeAmount: active.reduce((s, i) => s + i.amount, 0),
      completed: completed.length,
      completedAmount: completed.reduce((s, i) => s + i.amount, 0),
      apex1: apex1.length,
      apex1Amount: apex1.reduce((s, i) => s + i.amount, 0),
      apex2: apex2.length,
      apex2Amount: apex2.reduce((s, i) => s + i.amount, 0),
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.searchTerm) fetchInvestments(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      fetchInvestments(1);
    }, 400);
    return () => clearTimeout(delay);
  }, [filters.searchTerm]);

  const handleConfirmInvestment = async () => {
    if (!confirmAction.investment) return;
    setActionLoading(true);
    setActionError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${url}admin/investments/${confirmAction.investment._id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setActionSuccess("Investment confirmed successfully!");
      setTimeout(() => {
        fetchInvestments(currentPage);
        setConfirmAction({ show: false, investment: null, type: "" });
        setActionSuccess("");
      }, 2000);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to confirm investment",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineInvestment = async () => {
    if (!confirmAction.investment) return;
    setActionLoading(true);
    setActionError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${url}admin/investments/${confirmAction.investment._id}/decline`,
        { reason: confirmAction.reason || "Payment proof unclear" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActionSuccess("Investment declined successfully!");
      setTimeout(() => {
        fetchInvestments(currentPage);
        setConfirmAction({ show: false, investment: null, type: "" });
        setActionSuccess("");
      }, 2000);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to decline investment",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      plan: "all",
      dateRange: "all",
      searchTerm: "",
    });
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvData = investments.map((i) => ({
      ID: i._id,
      User: i.user?.email || "Unknown",
      Plan: i.plan?.toUpperCase() || "N/A",
      Amount: i.amount,
      "Expected Return": i.expectedReturn,
      "Total Withdrawn": i.totalWithdrawn || 0,
      "Payment Status": i.paymentStatus,
      "Investment Status": i.investmentStatus,
      "Start Date": i.startDate
        ? new Date(i.startDate).toLocaleDateString()
        : "N/A",
      "End Date": i.endDate ? new Date(i.endDate).toLocaleDateString() : "N/A",
      Withdrawals: i.withdrawals?.length || 0,
      Created: new Date(i.createdAt).toLocaleDateString(),
    }));
    if (!csvData.length) return;
    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map((obj) => Object.values(obj).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const u = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = `investments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const viewPaymentProof = (investment) => {
    if (investment.paymentProof) {
      setProofImage(investment.paymentProof);
      setShowProofModal(true);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentStatusConfig = (status) =>
    ({
      confirmed: {
        label: "Confirmed",
        cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        dot: "bg-emerald-500",
      },
      pending: {
        label: "Pending",
        cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        dot: "bg-amber-500",
      },
      declined: {
        label: "Declined",
        cls: "bg-red-50 text-red-700 ring-1 ring-red-200",
        dot: "bg-red-500",
      },
    })[status] || {
      label: status,
      cls: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
      dot: "bg-gray-400",
    };

  const getInvestmentStatusConfig = (status) =>
    ({
      active: {
        label: "Active",
        cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        dot: "bg-blue-500",
      },
      completed: {
        label: "Completed",
        cls: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
        dot: "bg-purple-500",
      },
      cancelled: {
        label: "Cancelled",
        cls: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
        dot: "bg-gray-400",
      },
    })[status] || {
      label: status,
      cls: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
      dot: "bg-gray-400",
    };

  const getPlanConfig = (plan) =>
    plan === "apex1"
      ? {
          label: "APEX 1",
          cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        }
      : {
          label: "APEX 2",
          cls: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
        };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.plan !== "all" ||
    filters.dateRange !== "all";

  const StatusBadge = ({ config }) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3 },
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Loading investments
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Investments
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review and manage all user investments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchInvestments(currentPage, true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing…" : "Refresh"}
              </span>
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* ── Stats Grid with Declined Card ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            {
              label: "Total",
              value: stats.total,
              amount: stats.totalAmount,
              color: "text-gray-900",
              amtColor: "text-gray-500",
              bg: "bg-white",
            },
            {
              label: "Pending",
              value: stats.pending,
              amount: stats.pendingAmount,
              color: "text-amber-600",
              amtColor: "text-amber-500",
              bg: "bg-amber-50/60",
              border: "border-amber-100",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              amount: stats.confirmedAmount,
              color: "text-emerald-600",
              amtColor: "text-emerald-500",
              bg: "bg-emerald-50/60",
              border: "border-emerald-100",
            },
            {
              label: "Declined",
              value: stats.declined,
              amount: stats.declinedAmount,
              color: "text-red-600",
              amtColor: "text-red-500",
              bg: "bg-red-50/60",
              border: "border-red-100",
            },
            {
              label: "Active",
              value: stats.active,
              amount: stats.activeAmount,
              color: "text-blue-600",
              amtColor: "text-blue-500",
              bg: "bg-blue-50/60",
              border: "border-blue-100",
            },
            {
              label: "Completed",
              value: stats.completed,
              amount: stats.completedAmount,
              color: "text-purple-600",
              amtColor: "text-purple-500",
              bg: "bg-purple-50/60",
              border: "border-purple-100",
            },
            {
              label: "APEX 1 / 2",
              value: `${stats.apex1}/${stats.apex2}`,
              amount: null,
              color: "text-gray-800",
              amtColor: "text-gray-500",
              bg: "bg-white",
              sub: `${formatCurrency(stats.apex1Amount).slice(0, 9)}… / …`,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={`${s.bg} rounded-xl border ${s.border || "border-gray-200/80"} p-4 shadow-sm cursor-help group relative`}
              title={
                s.label === "Declined"
                  ? "Investments that were declined by admin"
                  : ""
              }
            >
              <p className="text-xs text-gray-500 font-medium mb-1.5">
                {s.label}
              </p>
              <p className={`text-xl font-bold ${s.color} leading-none`}>
                {s.value}
              </p>
              {s.amount !== null && (
                <p className={`text-xs ${s.amtColor} mt-1.5 truncate`}>
                  {formatCurrency(s.amount)}
                </p>
              )}
              {s.sub && (
                <p className="text-xs text-gray-400 mt-1.5 truncate">{s.sub}</p>
              )}
              {s.label === "Declined" && stats.declined > 0 && (
                <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <span className="text-[10px] text-gray-500">ⓘ</span>
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Pending & Declined Alerts ── */}
        <AnimatePresence>
          {(stats.pending > 0 || stats.declined > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.pending > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-5 sm:p-6 text-white shadow-lg shadow-amber-200"
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-base">
                          {stats.pending} investment
                          {stats.pending > 1 ? "s" : ""} awaiting review
                        </p>
                        <p className="text-sm text-white/80 mt-0.5">
                          Total pending: {formatCurrency(stats.pendingAmount)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, status: "pending" })
                      }
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-white text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-all shadow-md"
                    >
                      Review now <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {stats.declined > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-5 sm:p-6 text-white shadow-lg shadow-red-200"
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-base">
                          {stats.declined} investment
                          {stats.declined > 1 ? "s" : ""} declined
                        </p>
                        <p className="text-sm text-white/80 mt-0.5">
                          Total declined: {formatCurrency(stats.declinedAmount)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, status: "declined" })
                      }
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all shadow-md"
                    >
                      View details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* ── Search & Filters ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or email…"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${hasActiveFilters ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
              {(hasActiveFilters || filters.searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {filters.status !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium ring-1 ring-blue-200">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "all" })}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.plan !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium ring-1 ring-teal-200">
                  Plan: {filters.plan.toUpperCase()}
                  <button
                    onClick={() => setFilters({ ...filters, plan: "all" })}
                    className="hover:text-teal-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateRange !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium ring-1 ring-purple-200">
                  Date: {filters.dateRange}
                  <button
                    onClick={() => setFilters({ ...filters, dateRange: "all" })}
                    className="hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Table with text action buttons ── */}
        {investments.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {[
                      "Investor",
                      "Plan",
                      "Amount",
                      "Payment",
                      "Investment",
                      "Progress",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${h === "Actions" ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {investments.map((inv, idx) => {
                    const payConf = getPaymentStatusConfig(inv.paymentStatus);
                    const invConf = getInvestmentStatusConfig(
                      inv.investmentStatus,
                    );
                    const planConf = getPlanConfig(inv.plan);
                    const total = inv.plan === "apex1" ? 2 : 3;
                    const done = inv.withdrawals?.length || 0;
                    const pct =
                      inv.investmentStatus === "completed"
                        ? 100
                        : inv.paymentStatus === "confirmed"
                          ? Math.round((done / total) * 100)
                          : 0;
                    const isDeclined = inv.paymentStatus === "declined";

                    return (
                      <motion.tr
                        key={inv._id}
                        custom={idx}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className={`hover:bg-gray-50/60 transition-colors ${isDeclined ? "bg-red-50/30" : ""}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isDeclined ? "bg-red-500" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}
                            >
                              {(inv.user?.email?.[0] || "U").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate max-w-[180px]">
                                {`${inv.user?.firstName || ""} ${inv.user?.lastName || ""}`}
                              </p>
                              <p className="font-medium text-xs text-gray-900 truncate max-w-[180px]">
                                {`@${inv.user?.referralCode}` || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-900 truncate max-w-[180px]">
                                {inv.user?.email || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">
                                #{inv._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${planConf.cls}`}
                          >
                            {inv.plan === "apex1" ? (
                              <Zap className="w-3 h-3" />
                            ) : (
                              <TrendingUp className="w-3 h-3" />
                            )}
                            {planConf.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p
                            className={`font-semibold ${isDeclined ? "text-red-600" : "text-gray-900"}`}
                          >
                            {formatCurrency(inv.amount)}
                          </p>
                          {!isDeclined && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              ↑ {formatCurrency(inv.expectedReturn)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge config={payConf} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge config={invConf} />
                        </td>
                        <td className="px-5 py-4">
                          {!isDeclined ? (
                            <div className="w-28">
                              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span>
                                  {done}/{total} phases
                                </span>
                                <span className="font-medium">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">
                              Declined
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(inv.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => viewPaymentProof(inv)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition text-xs font-medium"
                              title="View proof"
                            >
                              <Image className="w-3.5 h-3.5" />
                              <span>Proof</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvestment(inv);
                                setShowDetailsModal(true);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition text-xs font-medium"
                              title="Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  show: true,
                                  investment: inv,
                                  type: "confirm",
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition text-xs font-medium"
                              title="Confirm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  show: true,
                                  investment: inv,
                                  type: "decline",
                                  reason: "",
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 transition text-xs font-medium"
                              title="Decline"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  show: true,
                                  investment: inv,
                                  type: "confirm",
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition text-xs font-medium"
                              title="Confirm and make active"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Activate</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards with text action buttons */}
            <div className="lg:hidden divide-y divide-gray-100">
              {investments.map((inv, idx) => {
                const payConf = getPaymentStatusConfig(inv.paymentStatus);
                const invConf = getInvestmentStatusConfig(inv.investmentStatus);
                const planConf = getPlanConfig(inv.plan);
                const total = inv.plan === "apex1" ? 2 : 3;
                const done = inv.withdrawals?.length || 0;
                const pct =
                  inv.investmentStatus === "completed"
                    ? 100
                    : inv.paymentStatus === "confirmed"
                      ? Math.round((done / total) * 100)
                      : 0;
                const isDeclined = inv.paymentStatus === "declined";

                return (
                  <motion.div
                    key={inv._id}
                    custom={idx}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className={`p-4 hover:bg-gray-50/50 transition-colors ${isDeclined ? "bg-red-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isDeclined ? "bg-red-500" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}
                        >
                          {(inv.user?.email?.[0] || "U").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
                            {inv.user?.email || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            #{inv._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${planConf.cls}`}
                      >
                        {planConf.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Amount</p>
                        <p
                          className={`text-sm font-semibold ${isDeclined ? "text-red-600" : "text-gray-900"}`}
                        >
                          {formatCurrency(inv.amount)}
                        </p>
                      </div>
                      {!isDeclined && (
                        <div>
                          <p className="text-xs text-gray-400">Expected</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(inv.expectedReturn)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <StatusBadge config={payConf} />
                      <StatusBadge config={invConf} />
                    </div>
                    {!isDeclined && (
                      <>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>
                              {done}/{total} phases
                            </span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {isDeclined && (
                      <div className="mb-3 p-2 bg-red-100 rounded-lg">
                        <p className="text-xs text-red-700 font-medium text-center">
                          This investment was declined
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {formatDate(inv.createdAt)}
                      </p>
                      <div className="flex items-center gap-1">
                        {inv.paymentProof && (
                          <button
                            onClick={() => viewPaymentProof(inv)}
                            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Image className="w-3.5 h-3.5" />
                            Proof
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedInvestment(inv);
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        {inv.paymentStatus === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  show: true,
                                  investment: inv,
                                  type: "confirm",
                                })
                              }
                              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  show: true,
                                  investment: inv,
                                  type: "decline",
                                  reason: "",
                                })
                              }
                              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </>
                        )}
                        {/* Add confirm button for declined investments in mobile view */}
                        {inv.paymentStatus === "declined" && (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                show: true,
                                investment: inv,
                                type: "confirm",
                              })
                            }
                            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Confirm and make active"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      fetchInvestments(p);
                    }}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg min-w-[36px] text-center">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      fetchInvestments(p);
                    }}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No investments found
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-5">
              {hasActiveFilters || filters.searchTerm
                ? "Try adjusting your filters"
                : "No investments have been made yet"}
            </p>
            {(hasActiveFilters || filters.searchTerm) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Summary Cards with Declined Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Plan Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Plan distribution
              </h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Apex 1",
                  count: stats.apex1,
                  amount: stats.apex1Amount,
                  pct: (stats.apex1 / (stats.total || 1)) * 100,
                  color: "bg-blue-500",
                },
                {
                  label: "Apex 2",
                  count: stats.apex2,
                  amount: stats.apex2Amount,
                  pct: (stats.apex2 / (stats.total || 1)) * 100,
                  color: "bg-teal-500",
                },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-700 font-medium">{p.label}</span>
                    <span className="text-gray-500">
                      {p.count} · {formatCurrency(p.amount)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${p.color} rounded-full transition-all duration-700`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown - Updated with Declined */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Status breakdown
              </h3>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Pending",
                  value: stats.pending,
                  color: "text-amber-600",
                },
                {
                  label: "Confirmed",
                  value: stats.confirmed,
                  color: "text-emerald-600",
                },
                {
                  label: "Declined",
                  value: stats.declined,
                  color: "text-red-600",
                },
                {
                  label: "Active",
                  value: stats.active,
                  color: "text-blue-600",
                },
                {
                  label: "Completed",
                  value: stats.completed,
                  color: "text-purple-600",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className={`text-sm font-semibold ${s.color}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary - Updated with Declined */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Financial summary
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Total", value: stats.totalAmount },
                { label: "Pending", value: stats.pendingAmount },
                { label: "Confirmed", value: stats.confirmedAmount },
                {
                  label: "Declined",
                  value: stats.declinedAmount,
                  color: "text-red-600",
                },
                { label: "Active", value: stats.activeAmount },
                { label: "Completed", value: stats.completedAmount },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span
                    className={`text-sm font-semibold ${s.color || "text-gray-900"}`}
                  >
                    {formatCurrency(s.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Same as before but with text buttons */}
      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">
                  Filter investments
                </h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Payment status
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["all", "pending", "confirmed", "declined"].map((v) => (
                      <label
                        key={v}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${filters.status === v ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={v}
                          checked={filters.status === v}
                          onChange={(e) =>
                            setFilters({ ...filters, status: e.target.value })
                          }
                          className="sr-only"
                        />
                        <span
                          className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${filters.status === v ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                        />
                        <span className="text-sm capitalize">
                          {v === "all" ? "All" : v}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Plan
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: "all", l: "All" },
                      { v: "apex1", l: "Apex 1" },
                      { v: "apex2", l: "Apex 2" },
                    ].map(({ v, l }) => (
                      <label
                        key={v}
                        className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${filters.plan === v ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={v}
                          checked={filters.plan === v}
                          onChange={(e) =>
                            setFilters({ ...filters, plan: e.target.value })
                          }
                          className="sr-only"
                        />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Date range
                  </p>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last 12 months</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 p-5 border-t border-gray-100">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedInvestment && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center justify-between p-5 border-b border-gray-100 z-10">
                <h3 className="font-semibold text-gray-900">
                  Investment details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedInvestment.plan === "apex1" ? "bg-blue-50" : "bg-teal-50"}`}
                  >
                    {selectedInvestment.plan === "apex1" ? (
                      <Zap className="w-6 h-6 text-blue-600" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedInvestment.plan.toUpperCase()} Investment
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {selectedInvestment._id}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                      <StatusBadge
                        config={getPaymentStatusConfig(
                          selectedInvestment.paymentStatus,
                        )}
                      />
                      <StatusBadge
                        config={getInvestmentStatusConfig(
                          selectedInvestment.investmentStatus,
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Investor */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${selectedInvestment.paymentStatus === "declined" ? "bg-red-500" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}
                  >
                    {(selectedInvestment.user?.email?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {selectedInvestment.user?.email || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {selectedInvestment.user?._id || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Amount",
                      value: selectedInvestment.amount,
                      color:
                        selectedInvestment.paymentStatus === "declined"
                          ? "text-red-700"
                          : "text-blue-700",
                      bg:
                        selectedInvestment.paymentStatus === "declined"
                          ? "bg-red-50"
                          : "bg-blue-50",
                    },
                    {
                      label: "Expected",
                      value: selectedInvestment.expectedReturn,
                      color: "text-emerald-700",
                      bg: "bg-emerald-50",
                    },
                    {
                      label: "Withdrawn",
                      value: selectedInvestment.totalWithdrawn || 0,
                      color: "text-purple-700",
                      bg: "bg-purple-50",
                    },
                    {
                      label: "Remaining",
                      value:
                        (selectedInvestment.expectedReturn || 0) -
                        (selectedInvestment.totalWithdrawn || 0),
                      color: "text-amber-700",
                      bg: "bg-amber-50",
                    },
                  ].map((f) => (
                    <div key={f.label} className={`${f.bg} rounded-xl p-3`}>
                      <p className={`text-xs ${f.color} mb-1`}>{f.label}</p>
                      <p
                        className={`font-bold ${f.color} text-sm sm:text-base leading-tight`}
                      >
                        {formatCurrency(f.value)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Created", value: selectedInvestment.createdAt },
                    { label: "Started", value: selectedInvestment.startDate },
                    {
                      label: "Next withdrawal",
                      value: selectedInvestment.nextWithdrawalDate,
                    },
                    { label: "Completed", value: selectedInvestment.endDate },
                  ].map((d) => (
                    <div key={d.label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">{d.label}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(d.value)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Withdrawals */}
                {selectedInvestment.withdrawals?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Withdrawal history
                    </p>
                    <div className="space-y-2">
                      {selectedInvestment.withdrawals.map((w, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Phase {i + 1}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(w.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(w.amount)}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${w.status === "processed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                            >
                              {w.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment proof */}
                {selectedInvestment.paymentProof && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Payment proof
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Uploaded:{" "}
                        {formatDate(selectedInvestment.paymentProof.uploadedAt)}
                      </p>
                      <button
                        onClick={() => viewPaymentProof(selectedInvestment)}
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Image className="w-4 h-4" /> View
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions - Show for pending AND declined with text buttons */}
                {(selectedInvestment.paymentStatus === "pending" ||
                  selectedInvestment.paymentStatus === "declined") && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {selectedInvestment.paymentStatus === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            setConfirmAction({
                              show: true,
                              investment: selectedInvestment,
                              type: "decline",
                              reason: "",
                            });
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          <Ban className="w-4 h-4" />
                          Decline
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            setConfirmAction({
                              show: true,
                              investment: selectedInvestment,
                              type: "confirm",
                            });
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Confirm payment
                        </button>
                      </>
                    )}
                    {selectedInvestment.paymentStatus === "declined" && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setConfirmAction({
                            show: true,
                            investment: selectedInvestment,
                            type: "confirm",
                          });
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Confirm & Activate
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm/Decline Modal */}
      <AnimatePresence>
        {confirmAction.show && confirmAction.investment && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${confirmAction.type === "confirm" ? "bg-emerald-50" : "bg-red-50"}`}
                  >
                    {confirmAction.type === "confirm" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Ban className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {confirmAction.type === "confirm"
                      ? confirmAction.investment.paymentStatus === "declined"
                        ? "Confirm Declined Investment"
                        : "Confirm investment"
                      : "Decline investment"}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setConfirmAction({
                      show: false,
                      investment: null,
                      type: "",
                    })
                  }
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {actionSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {actionSuccess}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {confirmAction.type === "confirm"
                        ? confirmAction.investment.paymentStatus === "declined"
                          ? `Confirm this previously declined ${formatCurrency(confirmAction.investment.amount)} investment? This will make it active.`
                          : `Confirm this ${formatCurrency(confirmAction.investment.amount)} investment?`
                        : `Decline this ${formatCurrency(confirmAction.investment.amount)} investment?`}
                    </p>
                    {confirmAction.type === "decline" && (
                      <textarea
                        value={confirmAction.reason || ""}
                        onChange={(e) =>
                          setConfirmAction({
                            ...confirmAction,
                            reason: e.target.value,
                          })
                        }
                        className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 mb-3 resize-none bg-gray-50 placeholder-gray-400"
                        rows="3"
                        placeholder="Reason for declining (optional)…"
                      />
                    )}
                    {actionError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-xs text-red-600">{actionError}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            show: false,
                            investment: null,
                            type: "",
                          })
                        }
                        disabled={actionLoading}
                        className="flex-1 py-2.5 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={
                          confirmAction.type === "confirm"
                            ? handleConfirmInvestment
                            : handleDeclineInvestment
                        }
                        disabled={actionLoading}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-white rounded-lg transition font-medium ${confirmAction.type === "confirm" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"} disabled:opacity-60`}
                      >
                        {actionLoading ? (
                          <>
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                            Processing…
                          </>
                        ) : confirmAction.type === "confirm" ? (
                          confirmAction.investment.paymentStatus ===
                          "declined" ? (
                            <>
                              <RotateCcw className="w-4 h-4" />
                              Confirm & Activate
                            </>
                          ) : (
                            "Confirm"
                          )
                        ) : (
                          "Decline"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Proof Modal */}
      <AnimatePresence>
        {showProofModal && proofImage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Payment proof
                </h3>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 bg-gray-50">
                {proofImage.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={`${url}uploads/${proofImage.filename}`}
                    alt="Payment proof"
                    className="w-full rounded-lg object-contain max-h-[60vh]"
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-3">
                      {proofImage.filename}
                    </p>
                    <a
                      href={`${url}uploads/${proofImage.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      <DownloadIcon className="w-4 h-4" /> Download file
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInvestments;
