import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Users,
  Gift,
  Copy,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  Share2,
  Link as LinkIcon,
  ChevronRight,
  RefreshCw,
  Search,
  Download,
  Clock,
  Crown,
  Star,
  X,
  Percent,
  Mail,
} from "lucide-react";
import { FaTwitter, FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";
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
const ReferralStatus = ({ referral }) => {
  if (referral.bonusPaid)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle className="w-3 h-3" />
        Paid
      </span>
    );
  if (referral.investmentAmount > 0)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 ring-1 ring-gray-200">
      <AlertCircle className="w-3 h-3" />
      No Investment
    </span>
  );
};

/* ═══════════════════════════════════════════════ */
const Referrals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showShareModal, setShowShareModal] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalBonus: 0,
    pendingBonus: 0,
    averageInvestment: 0,
    topReferral: null,
    conversionRate: 0,
  });

  const fetchReferrals = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${url}users/referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;
      setReferrals(data.referrals || []);
      calculateStats(data.referrals || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else setError(err.response?.data?.message || "Failed to load referrals");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const calculateStats = (data) => {
    const active = data.filter((r) => r.investmentAmount > 0);
    setStats({
      totalReferrals: data.length,
      activeReferrals: active.length,
      totalBonus: data.reduce(
        (s, r) => s + (r.bonusPaid ? r.investmentAmount * 0.05 : 0),
        0,
      ),
      pendingBonus: data.reduce(
        (s, r) =>
          s +
          (!r.bonusPaid && r.investmentAmount > 0
            ? r.investmentAmount * 0.05
            : 0),
        0,
      ),
      averageInvestment: active.length
        ? active.reduce((s, r) => s + r.investmentAmount, 0) / active.length
        : 0,
      topReferral: active.length
        ? active.reduce(
            (m, r) => (r.investmentAmount > m.investmentAmount ? r : m),
            active[0],
          )
        : null,
      conversionRate: data.length ? (active.length / data.length) * 100 : 0,
    });
  };

  const referralLink = `${window.location.origin}/apex_frontend/#/register?ref=${user?.referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform) => {
    const text =
      "Join me on Apex Trading Square and earn 5% referral bonus on your investments!";
    const map = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + referralLink)}`,
      email: `mailto:?subject=Join Apex Trading Square&body=${encodeURIComponent(text + "\n\n" + referralLink)}`,
    };
    window.open(map[platform], "_blank");
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
        })
      : "N/A";

  const getFiltered = () => {
    let list = [...referrals];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.user?.email?.toLowerCase().includes(q) ||
          r.user?.firstName?.toLowerCase().includes(q) ||
          r.user?.lastName?.toLowerCase().includes(q),
      );
    }
    if (filterStatus === "active")
      list = list.filter((r) => r.investmentAmount > 0);
    if (filterStatus === "pending")
      list = list.filter((r) => !r.investmentAmount);
    list.sort((a, b) => {
      if (sortBy === "amount")
        return (b.investmentAmount || 0) - (a.investmentAmount || 0);
      if (sortBy === "name")
        return (a.user?.email || "").localeCompare(b.user?.email || "");
      return new Date(b.date) - new Date(a.date);
    });
    return list;
  };

  const handleExport = () => {
    const rows = filteredReferrals.map((r) => ({
      Name: r.user?.email || "Pending",
      Email: r.user?.email || "N/A",
      "Investment Amount": r.investmentAmount || 0,
      "Bonus Earned": r.bonusPaid ? r.investmentAmount * 0.05 : 0,
      Status: r.bonusPaid
        ? "Paid"
        : r.investmentAmount > 0
          ? "Pending"
          : "No Investment",
      "Date Joined": r.date ? new Date(r.date).toLocaleDateString() : "N/A",
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `referrals-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredReferrals = getFiltered();

  const statCards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals,
      sub: `${stats.activeReferrals} active`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      isNum: true,
    },
    {
      label: "Bonus Earned",
      value: fmt(stats.totalBonus),
      sub: `${fmt(stats.pendingBonus)} pending`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      isNum: false,
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      sub: `${stats.activeReferrals} of ${stats.totalReferrals} invested`,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
      isNum: false,
    },
    {
      label: "Avg. Investment",
      value: fmt(stats.averageInvestment),
      sub: "Per active referral",
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
      isNum: false,
    },
  ];

  /* ── loading ── */
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-blue-600/30 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">
            Loading referrals…
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
            Network
          </p>
          <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your network and earn 5% on every investment
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 flex-wrap shrink-0"
        >
          <button
            onClick={() => fetchReferrals(true)}
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
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </motion.div>
      </motion.div>

      {/* ── REFERRAL LINK BANNER ── */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden bg-[#0b0f1a] rounded-2xl p-5 mb-6"
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Your Referral Link
              </p>
              <p className="text-white/50 text-xs mt-0.5">
                Earn <span className="text-emerald-400 font-bold">5%</span> when
                friends invest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/8 border border-white/10 px-3 py-2 rounded-lg flex-1 sm:flex-none sm:max-w-[260px] overflow-hidden">
              <code className="text-white/60 text-xs font-mono truncate block">
                {referralLink}
              </code>
            </div>
            <button
              onClick={handleCopyReferral}
              className="relative shrink-0 w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg flex items-center justify-center text-white transition"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* quick share row */}
        <div className="relative z-10 flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
          <span className="text-[11px] text-white/40 uppercase tracking-wider mr-1">
            Share:
          </span>
          {[
            { icon: FaWhatsapp, label: "WhatsApp", fn: "whatsapp" },
            { icon: FaTwitter, label: "Twitter", fn: "twitter" },
            { icon: FaFacebook, label: "Facebook", fn: "facebook" },
            { icon: FaEnvelope, label: "Email", fn: "email" },
          ].map(({ icon: Icon, label, fn }) => (
            <button
              key={fn}
              onClick={() => shareOnSocial(fn)}
              title={label}
              className="w-8 h-8 bg-white/8 hover:bg-white/18 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {statCards.map((s, i) => {
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
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">
                {s.label}
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── TOP REFERRAL BANNER ── */}
      {stats.topReferral && (
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 mb-6 text-white"
        >
          <div className="absolute right-0 top-0 h-full w-40 opacity-10">
            <Crown className="w-full h-full" />
          </div>
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wider mb-0.5">
                  Top Referral
                </p>
                <p className="font-bold text-sm">
                  {stats.topReferral.user?.email || "Anonymous"}
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  Invested {fmt(stats.topReferral.investmentAmount)} · You
                  earned {fmt(stats.topReferral.investmentAmount * 0.05)}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold">
              <Star className="w-3.5 h-3.5" /> Top Investor
            </div>
          </div>
        </motion.div>
      )}

      {/* ── FILTER BAR ── */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
          {[
            { key: "all", label: "All", count: stats.totalReferrals },
            { key: "active", label: "Active", count: stats.activeReferrals },
            {
              key: "pending",
              label: "Pending",
              count: stats.totalReferrals - stats.activeReferrals,
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterStatus(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === t.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {t.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filterStatus === t.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-gray-50"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-1.5 px-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-gray-50 text-gray-600"
          >
            <option value="date">By Date</option>
            <option value="amount">By Amount</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </motion.div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {/* ── REFERRALS TABLE ── */}
      {filteredReferrals.length > 0 ? (
        <motion.div
          custom={7}
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
                    "Referral",
                    "Joined",
                    "Investment",
                    "Your Bonus",
                    "Status",
                    "",
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
                {filteredReferrals.map((ref, i) => {
                  const bonus = ref.investmentAmount
                    ? ref.investmentAmount * 0.05
                    : 0;
                  const initials =
                    ref.user?.firstName?.[0] || ref.user?.email?.[0] || "?";
                  return (
                    <motion.tr
                      key={i}
                      custom={i}
                      variants={fadeUp}
                      className="hover:bg-gray-50/60 transition group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {ref.user?.firstName && ref.user?.lastName
                                ? `${ref.user.firstName} ${ref.user.lastName}`
                                : ref.user?.email || "Pending Registration"}
                            </p>
                            {ref.user?.email && (
                              <p className="text-[11px] text-gray-400 truncate">
                                {ref.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {fmtDate(ref.date)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                        {ref.investmentAmount > 0 ? (
                          fmt(ref.investmentAmount)
                        ) : (
                          <span className="text-gray-300 font-normal">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-emerald-600">
                        {bonus > 0 ? (
                          fmt(bonus)
                        ) : (
                          <span className="text-gray-300 font-normal">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <ReferralStatus referral={ref} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {ref.user && (
                          <button
                            onClick={() => navigate(`/profile/${ref.user._id}`)}
                            className="text-xs text-blue-600 font-semibold inline-flex items-center gap-0.5 hover:gap-1.5 transition-all opacity-0 group-hover:opacity-100"
                          >
                            View <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 p-16 text-center mb-6"
        >
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">
            No referrals yet
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            Share your referral link and earn 5% when friends invest.
          </p>
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" /> Share Your Referral Link
          </button>
        </motion.div>
      )}

      {/* ── INFO CARDS ── */}
      <motion.div
        custom={8}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4" /> How Referral Bonus Works
          </h3>
          <ul className="space-y-2">
            {[
              "You get 5% bonus when your referral makes their first investment",
              "Bonus is one-time per referral (first investment only)",
              "Bonus activates after admin confirms their payment",
              "Minimum ₦10,000 needed to withdraw referral bonuses",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-xs text-blue-800 leading-relaxed"
              >
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />{" "}
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Tips to Maximize Referrals
          </h3>
          <ul className="space-y-2">
            {[
              "Share your personal success story with potential referrals",
              "Post your referral link across all social media platforms",
              "Explain the benefits of both Apex1 and Apex2 plans",
              "Follow up with interested friends to help them get started",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-xs text-emerald-800 leading-relaxed"
              >
                <Star className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
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
                  Share Referral Link
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Earn 5% on every investment they make
                </p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* link display */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 mb-5">
                <code className="text-xs font-mono text-blue-600 truncate flex-1">
                  {referralLink}
                </code>
                <button
                  onClick={handleCopyReferral}
                  className="shrink-0 w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>

              {/* social buttons */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  {
                    icon: FaWhatsapp,
                    label: "WhatsApp",
                    fn: "whatsapp",
                    bg: "bg-[#25D366] hover:bg-[#20b958]",
                  },
                  {
                    icon: FaTwitter,
                    label: "Twitter",
                    fn: "twitter",
                    bg: "bg-[#1DA1F2] hover:bg-[#1a91da]",
                  },
                  {
                    icon: FaFacebook,
                    label: "Facebook",
                    fn: "facebook",
                    bg: "bg-[#1877F2] hover:bg-[#166fe5]",
                  },
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    fn: "email",
                    bg: "bg-gray-700 hover:bg-gray-800",
                  },
                ].map(({ icon: Icon, label, fn, bg }) => (
                  <button
                    key={fn}
                    onClick={() => shareOnSocial(fn)}
                    className={`flex items-center justify-center gap-2 py-2.5 ${bg} text-white text-sm font-medium rounded-xl transition`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>

              {/* QR placeholder */}
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">
                  Scan QR Code
                </p>
                <div className="w-28 h-28 bg-gray-200 mx-auto rounded-xl flex items-center justify-center">
                  <span className="text-xs text-gray-400">QR Code</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
