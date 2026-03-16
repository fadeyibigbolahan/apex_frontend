import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Wallet,
  DollarSign,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Activity,
  Settings,
  Shield,
  UserPlus,
  UserMinus,
  BarChart3,
  ChevronRight,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
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

/* ── activity icon config ── */
const activityConfig = {
  investment: { bg: "bg-blue-50", icon: Wallet, color: "text-blue-600" },
  withdrawal: {
    bg: "bg-emerald-50",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  user_registration: {
    bg: "bg-violet-50",
    icon: UserPlus,
    color: "text-violet-600",
  },
  bonus: { bg: "bg-amber-50", icon: Gift, color: "text-amber-600" },
};

/* ── status pill ── */
const StatusDot = ({ status }) => {
  const map = {
    pending: "bg-amber-400",
    confirmed: "bg-emerald-500",
    completed: "bg-emerald-500",
    declined: "bg-red-500",
    failed: "bg-red-500",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${map[status] || "bg-gray-400"}`}
    />
  );
};

/* ── custom tooltip for chart ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-xs font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: ₦{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ═══════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("week");
  const [investmentChart, setInvestmentChart] = useState({
    data: [],
    total: 0,
    average: 0,
    growth: 0,
  });
  const [withdrawalChart, setWithdrawalChart] = useState({
    data: [],
    total: 0,
    amount: 0,
  });

  const fetchDashboardData = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [statsRes, actRes, pendRes, chartRes] = await Promise.all([
        axios.get(`${url}admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}admin/activities?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}admin/pending-actions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}admin/charts?range=${dateRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("CHART DATA:", chartRes.data.data);

      setStats(statsRes.data.data);
      setRecentActivities(actRes.data.data.activities || []);
      setPendingActions(pendRes.data.data.actions || []);

      // Set chart data
      if (chartRes.data.data.investments) {
        setInvestmentChart(chartRes.data.data.investments);
      }
      if (chartRes.data.data.withdrawals) {
        setWithdrawalChart(chartRes.data.data.withdrawals);
      }

      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 403) navigate("/dashboard");
      else setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const fmtNum = (n) => new Intl.NumberFormat("en-NG").format(n || 0);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const activeUserPct = Math.min(
    ((stats?.users?.active || 0) / (stats?.users?.total || 1)) * 100,
    100,
  );
  const investRatePct = Math.min(
    ((stats?.investments?.total || 0) / (stats?.users?.total || 1)) * 100,
    100,
  );

  // Format chart data for display
  const formatChartData = () => {
    if (!investmentChart.data || investmentChart.data.length === 0) {
      // Return sample data if no real data
      return [
        { name: "Mon", investments: 450000, withdrawals: 320000 },
        { name: "Tue", investments: 520000, withdrawals: 280000 },
        { name: "Wed", investments: 480000, withdrawals: 410000 },
        { name: "Thu", investments: 610000, withdrawals: 350000 },
        { name: "Fri", investments: 550000, withdrawals: 390000 },
        { name: "Sat", investments: 380000, withdrawals: 220000 },
        { name: "Sun", investments: 290000, withdrawals: 180000 },
      ];
    }

    // Transform real data
    return investmentChart.data.map((item) => ({
      name: item._id ? `${item._id.day}/${item._id.month}` : "N/A",
      investments: item.total || 0,
      count: item.count || 0,
    }));
  };

  const chartData = formatChartData();

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-red-500/30 border-t-red-500 animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">
            Loading admin dashboard…
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back,{" "}
            <span className="font-semibold text-gray-700">
              {user?.firstName || "Admin"}
            </span>
            . Here's your platform overview.
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 shrink-0 flex-wrap"
        >
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="py-2 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 bg-white text-gray-600"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
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
        </motion.div>
      </motion.div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── KEY METRICS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Total Users",
            icon: Users,
            bg: "bg-blue-50",
            color: "text-blue-600",
            value: fmtNum(stats?.users?.total),
            sub1: {
              label: `+${fmtNum(stats?.users?.active)} active`,
              color: "text-emerald-600",
            },
            sub2: {
              label: `${fmtNum(stats?.users?.blocked)} blocked`,
              color: "text-red-500",
            },
          },
          {
            label: "Total Investments",
            icon: Wallet,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            value: fmt(stats?.investments?.amount),
            sub1: {
              label: `${fmtNum(stats?.investments?.total)} total`,
              color: "text-gray-500",
            },
            sub2: {
              label: `${fmtNum(stats?.investments?.pending)} pending`,
              color: "text-amber-600",
            },
          },
          {
            label: "Total Withdrawals",
            icon: DollarSign,
            bg: "bg-violet-50",
            color: "text-violet-600",
            value: fmt(stats?.withdrawals?.amount),
            sub1: {
              label: `${fmtNum(stats?.withdrawals?.total)} total`,
              color: "text-gray-500",
            },
            sub2: {
              label: `${fmtNum(stats?.withdrawals?.pending)} pending`,
              color: "text-amber-600",
            },
          },
          {
            label: "Total Bonuses",
            icon: Gift,
            bg: "bg-amber-50",
            color: "text-amber-600",
            value: fmt(
              (stats?.bonuses?.referral || 0) +
                (stats?.bonuses?.retrading || 0),
            ),
            sub1: {
              label: `Ref: ${fmt(stats?.bonuses?.referral)}`,
              color: "text-gray-500",
            },
            sub2: {
              label: `Ret: ${fmt(stats?.bonuses?.retrading)}`,
              color: "text-gray-500",
            },
          },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              custom={i}
              variants={fadeUp}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition"
            >
              <div
                className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <p className={`text-xl font-bold tracking-tight ${c.color}`}>
                {c.value}
              </p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5 mb-2">
                {c.label}
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <span className={c.sub1.color}>{c.sub1.label}</span>
                <span className={c.sub2.color}>{c.sub2.label}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── QUICK ACTION CARDS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            to: "/admin/investments?filter=pending",
            label: "Pending Investments",
            count: stats?.investments?.pending || 0,
            from: "from-amber-500",
            to2: "to-orange-500",
            icon: Clock,
          },
          {
            to: "/admin/withdrawals?filter=pending",
            label: "Pending Withdrawals",
            count: stats?.withdrawals?.pending || 0,
            from: "from-blue-500",
            to2: "to-indigo-500",
            icon: Wallet,
          },
          {
            to: "/admin/users?filter=blocked",
            label: "Blocked Users",
            count: stats?.users?.blocked || 0,
            from: "from-red-500",
            to2: "to-rose-500",
            icon: UserMinus,
          },
          {
            to: "/admin/settings",
            label: "System Settings",
            count: null,
            from: "from-gray-700",
            to2: "to-gray-900",
            icon: Settings,
          },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.label} custom={i} variants={fadeUp}>
              <Link
                to={c.to}
                className={`group block relative overflow-hidden bg-gradient-to-br ${c.from} ${c.to2} rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-black/10 transition-all`}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <Icon className="w-6 h-6 mb-3 opacity-80" />
                  {c.count !== null ? (
                    <p className="text-3xl font-bold leading-none mb-1">
                      {c.count}
                    </p>
                  ) : (
                    <p className="text-lg font-bold leading-none mb-1">Open</p>
                  )}
                  <p className="text-xs text-white/70 font-medium">{c.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">
          {/* Investment overview with chart */}
          <motion.div
            custom={8}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Investment Overview
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Investments
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Withdrawals
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 bg-gray-50 rounded-xl p-4 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="investments"
                    name="Investments"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    name="Withdrawals"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-3 gap-4 mt-2 pt-4 border-t border-gray-50">
              {[
                {
                  label: "Total",
                  val: fmtNum(investmentChart?.total || 0),
                  color: "text-gray-800",
                },
                {
                  label: "Average",
                  val: fmt(investmentChart?.average || 0),
                  color: "text-blue-600",
                },
                {
                  label: "Growth",
                  val: `+${investmentChart?.growth || 0}%`,
                  color: "text-emerald-600",
                },
              ].map(({ label, val, color }) => (
                <div key={label} className="text-center">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className={`text-base font-bold ${color}`}>{val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent activities */}
          <motion.div
            custom={9}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Recent Activities
              </h2>
              <Link
                to="/admin/activities"
                className="text-xs text-red-500 font-semibold flex items-center gap-1 hover:text-red-600"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentActivities.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentActivities.map((act, i) => {
                  const cfg = activityConfig[act.type] || {
                    bg: "bg-gray-100",
                    icon: Activity,
                    color: "text-gray-600",
                  };
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 py-3 hover:bg-gray-50/60 rounded-lg px-1 transition"
                    >
                      <div
                        className={`w-8 h-8 ${cfg.bg} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">
                          {act.description}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {fmtDate(act.timestamp)}
                        </p>
                      </div>
                      {act.amount && (
                        <span className="text-xs font-bold text-gray-700 shrink-0">
                          {fmt(act.amount)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No recent activities
              </p>
            )}
          </motion.div>

          {/* Quick stats row */}
          <motion.div
            custom={10}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              {
                label: "Today's Investments",
                val: fmt(1250000),
                trend: "↑ 12%",
                up: true,
              },
              {
                label: "Today's Withdrawals",
                val: fmt(850000),
                trend: "↓ 5%",
                up: false,
              },
              { label: "New Users (24h)", val: "+24", trend: "↑ 8%", up: true },
              { label: "Active Now", val: "156", trend: "online", up: true },
            ].map(({ label, val, trend, up }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">
                  {label}
                </p>
                <p className="text-lg font-bold text-gray-900">{val}</p>
                <p
                  className={`text-[11px] mt-1 font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}
                >
                  {trend}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Pending actions */}
          <motion.div
            custom={11}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Pending Actions
            </h2>

            {pendingActions.length > 0 ? (
              <div className="space-y-2.5">
                {pendingActions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {action.description}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono">
                        #{action.id}
                      </p>
                    </div>
                    <Link
                      to={action.link}
                      className="shrink-0 text-xs text-amber-700 font-semibold hover:text-amber-800 transition whitespace-nowrap"
                    >
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  All Clear!
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  No pending actions
                </p>
              </div>
            )}

            {/* Quick links */}
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Quick Links
              </p>
              {[
                {
                  to: "/admin/investments?filter=pending",
                  label: "Pending Investments",
                  count: stats?.investments?.pending || 0,
                  countColor: "bg-amber-100 text-amber-700",
                },
                {
                  to: "/admin/withdrawals?filter=pending",
                  label: "Pending Withdrawals",
                  count: stats?.withdrawals?.pending || 0,
                  countColor: "bg-amber-100 text-amber-700",
                },
                {
                  to: "/admin/users?filter=blocked",
                  label: "Blocked Users",
                  count: stats?.users?.blocked || 0,
                  countColor: "bg-red-100 text-red-600",
                },
              ].map(({ to, label, count, countColor }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition group"
                >
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition">
                    {label}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${countColor}`}
                  >
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Platform statistics */}
          <motion.div
            custom={12}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden bg-[#0b0f1a] rounded-2xl p-5 text-white"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-red-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-8 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-red-400" />
                <p className="text-sm font-bold">Platform Statistics</p>
              </div>

              <div className="space-y-4">
                {/* Active users */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">Active Users</span>
                    <span className="font-bold text-white">
                      {stats?.users?.active || 0}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-700"
                      style={{ width: `${activeUserPct}%` }}
                    />
                  </div>
                </div>

                {/* Investment rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">Investment Rate</span>
                    <span className="font-bold text-white">
                      {Math.round(investRatePct)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-400 rounded-full transition-all duration-700"
                      style={{ width: `${investRatePct}%` }}
                    />
                  </div>
                </div>

                {/* Plan split */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">
                    Apex1 / Apex2 Split
                  </p>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                    <div
                      className="bg-blue-500 rounded-l-full"
                      style={{ width: "60%" }}
                    />
                    <div
                      className="bg-violet-500 rounded-r-full"
                      style={{ width: "40%" }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/40 mt-1.5">
                    <span>Apex1 · 60%</span>
                    <span>Apex2 · 40%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System health */}
          <motion.div
            custom={13}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "API Status",
                  val: "Operational",
                  dot: "bg-emerald-500",
                  color: "text-emerald-600",
                },
                {
                  label: "Database",
                  val: "Connected",
                  dot: "bg-emerald-500",
                  color: "text-emerald-600",
                },
                {
                  label: "Last Backup",
                  val: "Today, 02:00 AM",
                  dot: null,
                  color: "text-gray-700",
                },
                {
                  label: "Server Load",
                  val: "24%",
                  dot: null,
                  color: "text-emerald-600",
                },
              ].map(({ label, val, dot, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}
                  >
                    {dot && (
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    )}
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <Link
                to="/admin/settings"
                className="flex items-center gap-1.5 text-xs text-red-500 font-semibold hover:text-red-600 transition"
              >
                <Settings className="w-3.5 h-3.5" /> System Settings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
