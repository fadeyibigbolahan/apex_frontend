import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Gift,
  Award,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  Users,
  Wallet,
  ArrowRight,
  X,
  History,
  Lock,
  Sparkles,
  Zap,
  Info,
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

/* ── status pill ── */
const BonusStatus = ({ status }) => {
  const map = {
    available: {
      label: "Available",
      bg: "bg-emerald-50 dark:bg-emerald-900/40",
      text: "text-emerald-700 dark:text-emerald-300",
      ring: "ring-emerald-200 dark:ring-emerald-800",
      Icon: CheckCircle,
    },
    pending_withdrawal: {
      label: "Pending Withdrawal",
      bg: "bg-amber-50 dark:bg-amber-900/40",
      text: "text-amber-700 dark:text-amber-300",
      ring: "ring-amber-200 dark:ring-amber-800",
      Icon: Clock,
    },
    withdrawn: {
      label: "Withdrawn",
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-400",
      ring: "ring-gray-200 dark:ring-gray-700",
      Icon: History,
    },
  };
  const s = map[status] || {
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
const Bonuses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawType, setWithdrawType] = useState("all");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [minBonusWithdrawal, setMinBonusWithdrawal] = useState(10000);
  const [hasActiveInvestment, setHasActiveInvestment] = useState(false);
  const [stats, setStats] = useState({
    totalReferral: 0,
    totalRetrading: 0,
    availableReferral: 0,
    availableRetrading: 0,
    pendingReferral: 0,
    pendingRetrading: 0,
    withdrawnReferral: 0,
    withdrawnRetrading: 0,
    totalAvailable: 0,
    totalPending: 0,
    totalWithdrawn: 0,
    minWithdrawal: 10000,
    withdrawalProgress: 0,
  });

  const fetchBonuses = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${url}bonuses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;
      setBonuses(data.bonuses || []);

      // 👇 Get min bonus withdrawal from the response
      const minAmount = data.minBonusWithdrawal || 10000;
      setMinBonusWithdrawal(minAmount);

      console.log("Fetched bonuses:", data.bonuses);
      // 👇 Update active investment and bank details from response
      setHasActiveInvestment(data.hasActiveInvestment || false);

      setStats((prev) => ({
        ...prev,
        minWithdrawal: minAmount,
      }));

      calculateStats(data.bonuses || [], data.totals);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else setError(err.response?.data?.message || "Failed to load bonuses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBonuses();
  }, []);

  const calculateStats = (data, totals) => {
    const byType = (type, status) =>
      data
        .filter((b) => b.type === type && b.status === status)
        .reduce((s, b) => s + b.amount, 0);

    const aR = byType("referral", "available");
    const aT = byType("retrading", "available");
    const pR = byType("referral", "pending_withdrawal");
    const pT = byType("retrading", "pending_withdrawal");
    const wR = byType("referral", "withdrawn");
    const wT = byType("retrading", "withdrawn");
    const totalAvailable = aR + aT;

    setStats({
      totalReferral: totals?.referral?.total || 0,
      totalRetrading: totals?.retrading?.total || 0,
      availableReferral: aR,
      availableRetrading: aT,
      pendingReferral: pR,
      pendingRetrading: pT,
      withdrawnReferral: wR,
      withdrawnRetrading: wT,
      totalAvailable: totalAvailable,
      totalPending: pR + pT,
      totalWithdrawn: wR + wT,
      minWithdrawal: minBonusWithdrawal,
      withdrawalProgress: Math.min(
        (totalAvailable / minBonusWithdrawal) * 100,
        100,
      ),
    });
  };

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    setWithdrawError("");

    // Check if user has bank details
    if (!user?.hasBankDetails) {
      setWithdrawError("Please add bank details before withdrawing");
      setWithdrawLoading(false);
      return;
    }

    // Check if user has active investment
    if (!hasActiveInvestment) {
      setWithdrawError("You need an active investment to withdraw bonuses");
      setWithdrawLoading(false);
      return;
    }

    // Check minimum amount
    if (stats.totalAvailable < minBonusWithdrawal) {
      setWithdrawError(
        `Minimum bonus withdrawal amount is ${fmt(minBonusWithdrawal)}. You have ${fmt(stats.totalAvailable)} available.`,
      );
      setWithdrawLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Use the new withdrawal endpoint
      const payload = {
        type: "bonus",
        withdrawalType: withdrawType === "all" ? "all" : withdrawType,
      };

      await axios.post(`${url}withdrawals/request`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWithdrawSuccess("Withdrawal request submitted successfully!");
      setTimeout(() => {
        fetchBonuses(true);
        setShowWithdrawModal(false);
        setWithdrawSuccess("");
        setWithdrawType("all");
      }, 2000);
    } catch (err) {
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

  const getFiltered = () => {
    let list = [...bonuses];
    if (activeTab !== "all") list = list.filter((b) => b.type === activeTab);
    if (dateRange !== "all") {
      const start = new Date();
      if (dateRange === "month") start.setMonth(start.getMonth() - 1);
      if (dateRange === "quarter") start.setMonth(start.getMonth() - 3);
      if (dateRange === "year") start.setFullYear(start.getFullYear() - 1);
      list = list.filter((b) => new Date(b.createdAt) >= start);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getMonthlyData = () => {
    const m = {};
    bonuses.forEach((b) => {
      const d = new Date(b.createdAt);
      const k = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      if (!m[k]) m[k] = { referral: 0, retrading: 0, total: 0 };
      if (b.status !== "pending_withdrawal") {
        m[k][b.type] += b.amount;
        m[k].total += b.amount;
      }
    });
    return Object.entries(m)
      .map(([month, data]) => ({ month, ...data }))
      .slice(-6);
  };

  const filteredBonuses = getFiltered();
  const monthlyData = getMonthlyData();
  const canWithdraw =
    stats.totalAvailable >= minBonusWithdrawal &&
    hasActiveInvestment &&
    user?.hasBankDetails;

  const tabs = [
    { key: "all", label: "All", count: bonuses.length },
    {
      key: "referral",
      label: "Referral",
      count: bonuses.filter((b) => b.type === "referral").length,
    },
    {
      key: "retrading",
      label: "Retrading",
      count: bonuses.filter((b) => b.type === "retrading").length,
    },
  ];

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 dark:border-blue-400/30 dark:border-t-blue-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            Loading bonuses…
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
            Earnings
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Bonuses
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Track and withdraw your referral and retrading bonuses
          </p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <button
            onClick={() => fetchBonuses(true)}
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

      {/* ── MINIMUM AMOUNT INFO BANNER ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">
              Bonus Withdrawal Requirements
            </p>
            <div className="flex items-center justify-between mt-2 bg-white/50 dark:bg-gray-900/30 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Minimum Bonus Withdrawal Amount:
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                {fmt(minBonusWithdrawal)}
              </span>
            </div>
            {!hasActiveInvestment && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                ⚠️ You need an active investment to withdraw bonuses
              </p>
            )}
            {!user?.hasBankDetails && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                ⚠️ Please add bank details in your profile before withdrawing
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── SUMMARY CARDS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Referral Bonus",
            value: fmt(stats.totalReferral),
            sub1: {
              label: "Available",
              val: fmt(stats.availableReferral),
              color: "text-emerald-600 dark:text-emerald-400",
            },
            sub2: {
              label: "Pending",
              val: fmt(stats.pendingReferral),
              color: "text-amber-600 dark:text-amber-400",
            },
            icon: Users,
            iconBg: "bg-blue-50 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            valColor: "text-blue-700 dark:text-blue-400",
          },
          {
            label: "Retrading Bonus",
            value: fmt(stats.totalRetrading),
            sub1: {
              label: "Available",
              val: fmt(stats.availableRetrading),
              color: "text-emerald-600 dark:text-emerald-400",
            },
            sub2: {
              label: "Pending",
              val: fmt(stats.pendingRetrading),
              color: "text-amber-600 dark:text-amber-400",
            },
            icon: TrendingUp,
            iconBg: "bg-violet-50 dark:bg-violet-900/30",
            iconColor: "text-violet-600 dark:text-violet-400",
            valColor: "text-violet-700 dark:text-violet-400",
          },
          {
            label: "Available to Withdraw",
            value: fmt(stats.totalAvailable),
            progress: true,
            icon: Wallet,
            iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            valColor: "text-emerald-700 dark:text-emerald-400",
          },
          {
            label: "Total Withdrawn",
            value: fmt(stats.totalWithdrawn),
            sub1: {
              label:
                stats.totalWithdrawn > 0
                  ? `${Math.round((stats.totalWithdrawn / (stats.totalReferral + stats.totalRetrading || 1)) * 100)}% of total`
                  : "No withdrawals yet",
              val: "",
              color: "text-gray-500 dark:text-gray-400",
            },
            icon: History,
            iconBg: "bg-amber-50 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            valColor: "text-amber-700 dark:text-amber-400",
          },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              custom={i}
              variants={fadeUp}
              className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <div
                className={`w-9 h-9 ${c.iconBg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4 h-4 ${c.iconColor}`} />
              </div>
              <p className={`text-xl font-bold tracking-tight ${c.valColor}`}>
                {c.value}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5 mb-2">
                {c.label}
              </p>
              {c.progress ? (
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                    <span>Min. {fmt(minBonusWithdrawal)}</span>
                    <span>{stats.withdrawalProgress.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 dark:from-blue-400 dark:to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${stats.withdrawalProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px]">
                  {c.sub1 && (
                    <span className={c.sub1.color}>
                      {c.sub1.label} {c.sub1.val}
                    </span>
                  )}
                  {c.sub2 && (
                    <span className={c.sub2.color}>
                      {c.sub2.label} {c.sub2.val}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── WITHDRAWAL CTA BANNER ── */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        {canWithdraw ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-16 w-32 h-32 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  Ready to Withdraw!
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  You have{" "}
                  <span className="text-emerald-400 font-semibold">
                    {fmt(stats.totalAvailable)}
                  </span>{" "}
                  available
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300"
            >
              Withdraw Bonuses
            </button>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Minimum withdrawal: {fmt(minBonusWithdrawal)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {stats.totalAvailable < minBonusWithdrawal ? (
                    <>
                      You need {fmt(minBonusWithdrawal - stats.totalAvailable)}{" "}
                      more to unlock withdrawal
                    </>
                  ) : !hasActiveInvestment ? (
                    <>You need an active investment to withdraw bonuses</>
                  ) : !user?.hasBankDetails ? (
                    <>Please add bank details in your profile to withdraw</>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── FILTER BAR ── */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {t.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === t.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="py-1.5 px-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Time</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 3 Months</option>
          <option value="year">Last 12 Months</option>
        </select>
      </motion.div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* ── MONTHLY CHART ── */}
      {monthlyData.length > 0 && (
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm"
        >
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-5">
            Bonus History
          </h2>
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((d, i) => {
              const maxVal = Math.max(...monthlyData.map((x) => x.total), 1);
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex flex-col-reverse gap-0.5">
                    {d.referral > 0 && (
                      <div
                        className="w-full bg-blue-500 dark:bg-blue-400 rounded-md transition-all duration-300"
                        style={{ height: `${(d.referral / maxVal) * 100}px` }}
                      />
                    )}
                    {d.retrading > 0 && (
                      <div
                        className="w-full bg-violet-400 dark:bg-violet-500 rounded-md transition-all duration-300"
                        style={{ height: `${(d.retrading / maxVal) * 100}px` }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400 rounded-sm" />
              <span className="text-[11px] text-gray-600 dark:text-gray-400">
                Referral
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-violet-400 dark:bg-violet-500 rounded-sm" />
              <span className="text-[11px] text-gray-600 dark:text-gray-400">
                Retrading
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── BONUSES LIST ── */}
      {filteredBonuses.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-3 mb-6"
        >
          {filteredBonuses.map((bonus, i) => {
            const isReferral = bonus.type === "referral";
            return (
              <motion.div
                key={bonus._id || i}
                custom={i}
                variants={fadeUp}
                className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isReferral
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "bg-violet-50 dark:bg-violet-900/30"
                      }`}
                    >
                      {isReferral ? (
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {isReferral ? "Referral Bonus" : "Retrading Bonus"}
                        </p>
                        <BonusStatus status={bonus.status} />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                        {fmtDate(bonus.createdAt)}
                      </p>
                      {isReferral && bonus.referredUser && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          From: {bonus.referredUser.referralCode || "User"}
                        </p>
                      )}
                      {!isReferral && bonus.metadata && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Investment:{" "}
                          {fmt(bonus.metadata?.investmentAmount || 0)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0">
                    <div className="sm:text-right">
                      <p
                        className={`text-xl font-bold tracking-tight ${
                          isReferral
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-violet-700 dark:text-violet-400"
                        }`}
                      >
                        {fmt(bonus.amount)}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {isReferral ? "5% rate" : "3% rate"}
                      </p>
                    </div>
                    {bonus.status === "available" && (
                      <button
                        onClick={() => {
                          setWithdrawType(
                            isReferral ? "referral" : "retrading",
                          );
                          setShowWithdrawModal(true);
                        }}
                        className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* meta row */}
                {bonus.metadata && (
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                        {isReferral ? "Investment Amount" : "New Investment"}
                      </p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {fmt(bonus.metadata.investmentAmount)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                        Bonus Rate
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          isReferral
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-violet-600 dark:text-violet-400"
                        }`}
                      >
                        {bonus.metadata.rate}%
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center mb-6"
        >
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
            No bonuses yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
            {activeTab === "referral"
              ? "Refer friends to earn 5% on their investments"
              : activeTab === "retrading"
                ? "Reinvest before full payout to earn 3% retrading bonuses"
                : "Start investing and referring to earn bonuses"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {activeTab !== "retrading" && (
              <Link
                to="/referrals"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Users className="w-4 h-4" /> Go to Referrals
              </Link>
            )}
            {activeTab !== "referral" && (
              <Link
                to="/investments/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <TrendingUp className="w-4 h-4" /> Make Investment
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* ── INFO CARDS ── */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Referral Bonus (5%)
          </h3>
          <ul className="space-y-2">
            {[
              "Earn 5% when your referred friend makes their first investment",
              "One-time bonus per referral (first investment only)",
              "Bonus activates after admin confirms their payment",
              "Track your referrals on the Referrals page",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300 leading-relaxed"
              >
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-5 border border-violet-200 dark:border-violet-800">
          <h3 className="text-sm font-bold text-violet-900 dark:text-violet-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Retrading Bonus (3%)
          </h3>
          <ul className="space-y-2">
            {[
              "Earn 3% when you reinvest before your current plan fully pays out",
              "Bonus is available immediately on the new investment",
              "No limit on how many times you can earn this bonus",
              "Works with both Apex1 and Apex2 plans",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-xs text-violet-800 dark:text-violet-300 leading-relaxed"
              >
                <CheckCircle className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── WITHDRAWAL MODAL ── */}
      {showWithdrawModal && (
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
                  Withdraw Bonuses
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Minimum: {fmt(minBonusWithdrawal)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawError("");
                  setWithdrawSuccess("");
                  setWithdrawType("all");
                }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {withdrawSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {withdrawSuccess}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Redirecting…
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-5">
                    {[
                      {
                        val: "all",
                        label: "All Bonuses",
                        sub: "Referral + Retrading",
                        amount: stats.totalAvailable,
                        color: "text-gray-800 dark:text-gray-200",
                        active:
                          "border-blue-500 bg-blue-50 dark:bg-blue-900/30",
                      },
                      {
                        val: "referral",
                        label: "Referral Bonus Only",
                        sub: "From referred friends",
                        amount: stats.availableReferral,
                        color: "text-blue-600 dark:text-blue-400",
                        active:
                          "border-blue-500 bg-blue-50 dark:bg-blue-900/30",
                      },
                      {
                        val: "retrading",
                        label: "Retrading Bonus Only",
                        sub: "From early reinvestments",
                        amount: stats.availableRetrading,
                        color: "text-violet-600 dark:text-violet-400",
                        active:
                          "border-violet-500 bg-violet-50 dark:bg-violet-900/30",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.val}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition ${
                          withdrawType === opt.val
                            ? opt.active
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="withdrawType"
                          value={opt.val}
                          checked={withdrawType === opt.val}
                          onChange={(e) => setWithdrawType(e.target.value)}
                          className="sr-only"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {opt.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {opt.sub}
                          </p>
                        </div>
                        <p className={`text-sm font-bold ${opt.color}`}>
                          {fmt(opt.amount)}
                        </p>
                      </label>
                    ))}
                  </div>

                  {stats.totalAvailable < minBonusWithdrawal && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        ⚠️ You need at least {fmt(minBonusWithdrawal)} to
                        withdraw. You have {fmt(stats.totalAvailable)}{" "}
                        available.
                      </p>
                    </div>
                  )}

                  {!hasActiveInvestment && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        ⚠️ You need an active investment to withdraw bonuses.
                      </p>
                    </div>
                  )}

                  {!user?.hasBankDetails && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        ⚠️ Please add bank details in your profile before
                        withdrawing.
                      </p>
                    </div>
                  )}

                  {withdrawError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
                      {withdrawError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowWithdrawModal(false);
                        setWithdrawError("");
                        setWithdrawType("all");
                      }}
                      disabled={withdrawLoading}
                      className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleWithdraw}
                      disabled={
                        withdrawLoading ||
                        !user?.hasBankDetails ||
                        !hasActiveInvestment ||
                        stats.totalAvailable < minBonusWithdrawal
                      }
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-500 dark:to-emerald-500 dark:hover:from-blue-600 dark:hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {withdrawLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Processing…
                        </span>
                      ) : (
                        "Withdraw"
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

export default Bonuses;
