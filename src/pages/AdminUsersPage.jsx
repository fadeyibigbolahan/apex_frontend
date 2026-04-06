import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  Edit2,
  Ban,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  DollarSign,
  Gift,
  TrendingUp,
  Shield,
  ChevronRight,
  X,
  UserCheck,
  UserX,
  Wallet,
  Award,
  Lock,
  Unlock,
  CreditCard,
  Save,
  ChevronLeft,
  User,
  Building,
  Hash,
  Calendar,
  EyeOff,
  Key,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

/* ── animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

/* ── helpers ── */
const UserStatus = ({ u }) => {
  if (u.isBlocked)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 ring-1 ring-red-200">
        <Ban className="w-3 h-3" />
        Blocked
      </span>
    );
  if (u.isActive)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 ring-1 ring-gray-200">
      <Clock className="w-3 h-3" />
      Inactive
    </span>
  );
};

const RolePill = ({ role }) =>
  role === "admin" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 ring-1 ring-violet-200">
      <Shield className="w-3 h-3" />
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
      <Users className="w-3 h-3" />
      User
    </span>
  );

const InfoTile = ({ label, value, mono }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p
      className={`text-xs font-semibold text-gray-800 truncate ${mono ? "font-mono" : ""}`}
    >
      {value || <span className="text-gray-300 font-normal">N/A</span>}
    </p>
  </div>
);

const Nigerian_Banks = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "FCMB",
  "GTBank",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC",
  "Standard Chartered",
  "Sterling Bank",
  "Union Bank",
  "UBA",
  "Wema Bank",
  "Zenith Bank",
];

/* ═══════════════════════════════════════════════ */
const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [referralsData, setReferralsData] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [referralsStats, setReferralsStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalBonus: 0,
  });
  const [blockAction, setBlockAction] = useState({ show: false, user: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [bankActionLoading, setBankActionLoading] = useState(false);
  const [bankActionSuccess, setBankActionSuccess] = useState("");
  const [bankActionError, setBankActionError] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searching, setSearching] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserSuccess, setEditUserSuccess] = useState("");
  const [editUserError, setEditUserError] = useState("");

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const itemsPerPage = 20;

  const [bankForm, setBankForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    isLocked: false,
  });

  const [editUserForm, setEditUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    referralCode: "",
  });

  const [filters, setFilters] = useState({
    status: "all",
    role: "all",
    verification: "all",
    dateRange: "all",
    searchTerm: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    admins: 0,
    verified: 0,
    totalInvested: 0,
  });

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("filter") === "blocked")
      setFilters((f) => ({ ...f, status: "blocked" }));
  }, [location]);

  const fetchUsers = async (page = 1, showRefreshLoader = false) => {
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
        ...(filters.role !== "all" && { role: filters.role }),
        ...(filters.verification !== "all" && {
          verification: filters.verification,
        }),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange }),
      });

      if (filters.searchTerm?.trim()) {
        params.append("search", filters.searchTerm.trim());
      }

      const res = await axios.get(`${url}admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      setUsers(data.data?.users || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
      calculateStats(data.data?.users || [], data.stats);
      setCurrentPage(page);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 403) navigate("/dashboard");
      else setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setSearching(true);

    const delayDebounce = setTimeout(() => {
      fetchUsers(1);
      setSearching(false);
    }, 400);

    return () => {
      clearTimeout(delayDebounce);
      setSearching(false);
    };
  }, [
    filters.status,
    filters.role,
    filters.verification,
    filters.dateRange,
    filters.searchTerm,
  ]);

  const calculateStats = (usersData, statsData) => {
    if (statsData) {
      setStats(statsData);
      return;
    }
    const active = usersData.filter((u) => u.isActive && !u.isBlocked).length;
    const blocked = usersData.filter((u) => u.isBlocked).length;
    const admins = usersData.filter((u) => u.role === "admin").length;
    const verified = usersData.filter(
      (u) => u.bankDetails?.accountNumber,
    ).length;
    const totalInvested = usersData.reduce(
      (s, u) => s + (u.totalInvested || 0),
      0,
    );
    setStats({
      total: usersData.length,
      active,
      blocked,
      pending: 0,
      admins,
      verified,
      totalInvested,
    });
  };

  const handleToggleBlock = async () => {
    if (!blockAction.user) return;
    setActionLoading(true);
    setActionError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${url}admin/users/${blockAction.user._id}/toggle-block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActionSuccess(
        `User ${blockAction.user.isBlocked ? "unblocked" : "blocked"} successfully!`,
      );
      setTimeout(() => {
        fetchUsers(currentPage);
        setBlockAction({ show: false, user: null });
        setActionSuccess("");
      }, 2000);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to update user status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    setEditUserError("");
    setEditUserSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${url}admin/users/${selectedUser._id}`,
        {
          firstName: editUserForm.firstName,
          lastName: editUserForm.lastName,
          email: editUserForm.email,
          phoneNumber: editUserForm.phoneNumber,
          role: editUserForm.role,
          referralCode: editUserForm.referralCode,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setEditUserSuccess("User details updated successfully!");
      setTimeout(() => {
        fetchUsers(currentPage);
        setShowEditUserModal(false);
        setEditUserSuccess("");
        setEditUserForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          role: "",
          referralCode: "",
        });
      }, 2000);
    } catch (err) {
      setEditUserError(
        err.response?.data?.message || "Failed to update user details",
      );
    } finally {
      setEditUserLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please fill in both password fields");
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      setPasswordLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${url}admin/users/${selectedUser._id}/change-password`,
        {
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPasswordSuccess("Password changed successfully!");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const openEditUserModal = (u) => {
    setSelectedUser(u);
    setEditUserForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      phoneNumber: u.phoneNumber || "",
      role: u.role || "user",
      referralCode: u.referralCode || "",
    });
    setEditUserError("");
    setEditUserSuccess("");
    setShowEditUserModal(true);
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    setBankActionLoading(true);
    setBankActionError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${url}admin/users/${selectedUser._id}/bank-details`,
        bankForm,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBankActionSuccess("Bank details updated successfully!");
      setTimeout(() => {
        fetchUsers(currentPage);
        setShowBankModal(false);
        setBankActionSuccess("");
        setBankForm({
          accountName: "",
          accountNumber: "",
          bankName: "",
          isLocked: false,
        });
      }, 2000);
    } catch (err) {
      setBankActionError(
        err.response?.data?.message || "Failed to update bank details",
      );
    } finally {
      setBankActionLoading(false);
    }
  };

  const openBankModal = (u) => {
    setSelectedUser(u);
    setBankForm({
      accountName: u.bankDetails?.accountName || "",
      accountNumber: u.bankDetails?.accountNumber || "",
      bankName: u.bankDetails?.bankName || "",
      isLocked: u.bankDetails?.isLocked || false,
    });
    setBankActionError("");
    setBankActionSuccess("");
    setShowBankModal(true);
  };

  const fetchUserReferrals = async (userId) => {
    setReferralsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url}admin/users/${userId}/referrals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReferralsData(response.data.data.referrals || []);
      setReferralsStats(
        response.data.data.stats || {
          totalReferrals: 0,
          activeReferrals: 0,
          totalBonus: 0,
        },
      );
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
      setReferralsData([]);
      setReferralsStats({
        totalReferrals: 0,
        activeReferrals: 0,
        totalBonus: 0,
      });
    } finally {
      setReferralsLoading(false);
    }
  };

  const openReferralsModal = async (u) => {
    setSelectedUser(u);
    setShowReferralsModal(true);
    await fetchUserReferrals(u._id);
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      role: "all",
      verification: "all",
      dateRange: "all",
      searchTerm: "",
    });
    setCurrentPage(1);
  };

  const handleExport = () => {
    const rows = users.map((u) => ({
      Name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "N/A",
      Email: u.email,
      Phone: u.phoneNumber || "N/A",
      Role: u.role,
      Status: u.isBlocked ? "Blocked" : u.isActive ? "Active" : "Inactive",
      "Total Invested": u.totalInvested || 0,
      "Total Withdrawn": u.totalWithdrawn || 0,
      "Referral Bonus": u.referralBonus || 0,
      "Retrading Bonus": u.retradingBonus || 0,
      "Bank Details": u.bankDetails?.accountNumber ? "Yes" : "No",
      "Bank Locked": u.bankDetails?.isLocked ? "Yes" : "No",
      Joined: new Date(u.createdAt).toLocaleDateString(),
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
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
    });
  const hasFilters =
    filters.status !== "all" ||
    filters.role !== "all" ||
    filters.verification !== "all" ||
    filters.dateRange !== "all" ||
    filters.searchTerm;

  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    fetchUsers(p);
  };

  const userName = (u) =>
    u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email;
  const userInitial = (u) =>
    (u.firstName?.[0] || u.email?.[0] || "U").toUpperCase();

  const closeModal = (fn) => () => fn(false);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-red-500/30 border-t-red-500 animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">Loading users…</p>
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage all users on the platform
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 shrink-0"
        >
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => fetchUsers(currentPage, true)}
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
        className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
      >
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-gray-800",
            bg: "bg-gray-100",
            icon: Users,
          },
          {
            label: "Active",
            value: stats.active,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: CheckCircle,
          },
          {
            label: "Blocked",
            value: stats.blocked,
            color: "text-red-600",
            bg: "bg-red-50",
            icon: Ban,
          },
          {
            label: "Admins",
            value: stats.admins,
            color: "text-violet-600",
            bg: "bg-violet-50",
            icon: Shield,
          },
          {
            label: "Verified",
            value: stats.verified,
            color: "text-blue-600",
            bg: "bg-blue-50",
            icon: CreditCard,
          },
          {
            label: "Invested",
            value: fmt(stats.totalInvested),
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: Wallet,
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition"
            >
              <div
                className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center mb-2`}
              >
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <p className={`text-base font-bold ${s.color} leading-none`}>
                {s.value}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── FILTER BAR ── */}
      <motion.div
        custom={6}
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
              placeholder="Search by name, email, phone…"
              value={filters.searchTerm}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  searchTerm: e.target.value,
                }));
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
            />
            {searching && (
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                Searching...
              </span>
            )}
            {filters.searchTerm && (
              <button
                onClick={() => setFilters({ ...filters, searchTerm: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                hasFilters
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
              {hasFilters && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
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

        {hasFilters &&
          (filters.status !== "all" ||
            filters.role !== "all" ||
            filters.verification !== "all" ||
            filters.dateRange !== "all") && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              {filters.status !== "all" && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onRemove={() => setFilters({ ...filters, status: "all" })}
                  color="bg-blue-50 text-blue-700"
                />
              )}
              {filters.role !== "all" && (
                <Chip
                  label={`Role: ${filters.role}`}
                  onRemove={() => setFilters({ ...filters, role: "all" })}
                  color="bg-violet-50 text-violet-700"
                />
              )}
              {filters.verification !== "all" && (
                <Chip
                  label={`Bank: ${filters.verification}`}
                  onRemove={() =>
                    setFilters({ ...filters, verification: "all" })
                  }
                  color="bg-emerald-50 text-emerald-700"
                />
              )}
              {filters.dateRange !== "all" && (
                <Chip
                  label={`Joined: ${filters.dateRange}`}
                  onRemove={() => setFilters({ ...filters, dateRange: "all" })}
                  color="bg-amber-50 text-amber-700"
                />
              )}
            </div>
          )}
      </motion.div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── TABLE ── */}
      {users.length > 0 ? (
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
                    "User",
                    "Role / Status",
                    "Contact",
                    "Financials",
                    "Bank",
                    "Joined",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest ${h === "Actions" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    custom={i}
                    variants={fadeUp}
                    className="hover:bg-gray-50/60 transition group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {userInitial(u)}
                        </div>
                        <div className="min-w-0">
                          {u.referralCode && (
                            <p className="text-sm font-semibold text-black mt-0.5">
                              {u.referralCode}
                            </p>
                          )}
                          <p className="text-xs text-gray-900 truncate">
                            {userName(u)}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <RolePill role={u.role} />
                        <UserStatus u={u} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <p className="text-[11px] text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[120px]">
                            {u.email}
                          </span>
                        </p>
                        {u.phoneNumber && (
                          <p className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 shrink-0" />
                            {u.phoneNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-gray-800">
                        {fmt(u.totalInvested)}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        W: {fmt(u.totalWithdrawn)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-violet-600 flex items-center gap-0.5">
                          <Gift className="w-3 h-3" />
                          {fmt(u.referralBonus)}
                        </span>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          {fmt(u.retradingBonus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.bankDetails?.accountNumber ? (
                        <div>
                          <p className="text-xs font-semibold text-gray-800 truncate max-w-[100px]">
                            {u.bankDetails.accountName}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[100px]">
                            {u.bankDetails.bankName}
                          </p>
                          <p className="text-[10px] font-mono text-gray-400">
                            {u.bankDetails.accountNumber}
                          </p>
                          {u.bankDetails.isLocked && (
                            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
                              <Lock className="w-2.5 h-2.5" />
                              Locked
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-300">
                          Not added
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {fmtDate(u.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setShowUserModal(true);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition text-xs font-medium"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openEditUserModal(u)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition text-xs font-medium"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => openBankModal(u)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition text-xs font-medium"
                          title="Edit Bank"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Bank</span>
                        </button>
                        <button
                          onClick={() => openReferralsModal(u)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition text-xs font-medium"
                          title="View Referrals"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Referrals</span>
                        </button>
                        <button
                          onClick={() =>
                            setBlockAction({ show: true, user: u })
                          }
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition text-xs font-medium ${
                            u.isBlocked
                              ? "hover:bg-emerald-50 text-emerald-600"
                              : "hover:bg-red-50 text-red-500"
                          }`}
                          title={u.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {u.isBlocked ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Unblock</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Block</span>
                            </>
                          )}
                        </button>
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
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition"
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
                        ? "bg-red-500 text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
            No users found
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            {hasFilters
              ? "Try adjusting your filters"
              : "No users have registered yet"}
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* ── BOTTOM INSIGHT CARDS ── */}
      <motion.div
        custom={8}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          {
            title: "Top Investors",
            icon: Award,
            dark: "from-blue-600 to-blue-700",
            data: [...users]
              .sort((a, b) => (b.totalInvested || 0) - (a.totalInvested || 0))
              .slice(0, 3),
            valFn: (u) => fmt(u.totalInvested || 0),
          },
          {
            title: "Top Referrers",
            icon: Gift,
            dark: "from-emerald-600 to-emerald-700",
            data: [...users]
              .sort((a, b) => (b.referralBonus || 0) - (a.referralBonus || 0))
              .slice(0, 3),
            valFn: (u) => fmt(u.referralBonus || 0),
          },
          {
            title: "Recent Joiners",
            icon: TrendingUp,
            dark: "from-violet-600 to-violet-700",
            data: [...users]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3),
            valFn: (u) => fmtDate(u.createdAt),
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden bg-gradient-to-br ${card.dark} rounded-2xl p-5 text-white`}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-white/70" />
                  <p className="text-sm font-bold">{card.title}</p>
                </div>
                <div className="space-y-2.5">
                  {card.data.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 bg-white/15 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs text-white/70 truncate">
                          {u.email}
                        </span>
                      </div>
                      <span className="text-xs font-bold shrink-0">
                        {card.valFn(u)}
                      </span>
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
        <Modal
          title="Filter Users"
          sub="Narrow your user list"
          onClose={closeModal(setShowFilterModal)}
        >
          <div className="p-6 space-y-6">
            {[
              {
                key: "status",
                label: "Status",
                opts: [
                  ["all", "All Users"],
                  ["active", "Active"],
                  ["blocked", "Blocked"],
                  ["pending", "Pending"],
                ],
              },
              {
                key: "role",
                label: "Role",
                opts: [
                  ["all", "All Roles"],
                  ["user", "Regular Users"],
                  ["admin", "Administrators"],
                ],
              },
              {
                key: "verification",
                label: "Bank Details",
                opts: [
                  ["all", "All"],
                  ["verified", "Has Bank"],
                  ["unverified", "No Bank"],
                ],
              },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {opts.map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setFilters({ ...filters, [key]: val })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        filters[key] === val
                          ? "bg-red-500 text-white border-red-500 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Join Date
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["all", "All Time"],
                  ["today", "Today"],
                  ["week", "Last 7 Days"],
                  ["month", "Last 30 Days"],
                  ["year", "Last 12 Mo."],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setFilters({ ...filters, dateRange: val })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      filters.dateRange === val
                        ? "bg-red-500 text-white border-red-500 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {lbl}
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
              className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Apply
            </button>
          </div>
        </Modal>
      )}

      {/* ── USER DETAILS MODAL ── */}
      {showUserModal && selectedUser && (
        <Modal
          title="User Details"
          sub={selectedUser._id}
          onClose={closeModal(setShowUserModal)}
          wide
        >
          <div className="p-6 h-[80vh] overflow-y-auto">
            {/* hero */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                {userInitial(selectedUser)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900 truncate">
                  {userName(selectedUser)}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {selectedUser.email}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <RolePill role={selectedUser.role} />
                  <UserStatus u={selectedUser} />
                </div>
              </div>
            </div>

            {/* info tiles */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <InfoTile label="User ID" value={selectedUser._id} mono />
              <InfoTile
                label="Referral Code"
                value={selectedUser.referralCode}
                mono
              />
              <InfoTile label="Phone" value={selectedUser.phoneNumber} />
              <InfoTile
                label="Joined"
                value={fmtDate(selectedUser.createdAt)}
              />
            </div>

            {/* financials */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Financial Summary
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                {
                  label: "Total Invested",
                  val: fmt(selectedUser.totalInvested),
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Total Withdrawn",
                  val: fmt(selectedUser.totalWithdrawn),
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Referral Bonus",
                  val: fmt(selectedUser.referralBonus),
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                },
                {
                  label: "Retrading Bonus",
                  val: fmt(selectedUser.retradingBonus),
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map(({ label, val, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3`}>
                  <p
                    className={`text-[10px] ${color} uppercase tracking-wide mb-0.5`}
                  >
                    {label}
                  </p>
                  <p className={`text-base font-bold ${color}`}>{val}</p>
                </div>
              ))}
            </div>

            {/* bank */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Bank Details
            </p>
            {selectedUser.bankDetails?.accountNumber ? (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 mb-5">
                {[
                  ["Account Name", selectedUser.bankDetails.accountName],
                  ["Account Number", selectedUser.bankDetails.accountNumber],
                  ["Bank Name", selectedUser.bankDetails.bankName],
                  [
                    "Lock Status",
                    selectedUser.bankDetails.isLocked ? "Locked" : "Unlocked",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-gray-400">{k}</span>
                    <span
                      className={`font-semibold ${
                        k === "Lock Status"
                          ? selectedUser.bankDetails.isLocked
                            ? "text-emerald-600"
                            : "text-amber-600"
                          : "text-gray-800"
                      }`}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 text-xs text-amber-700">
                No bank details added
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  openEditUserModal(selectedUser);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit User
              </button>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  openBankModal(selectedUser);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Edit Bank
              </button>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  openReferralsModal(selectedUser);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Referrals
              </button>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setBlockAction({ show: true, user: selectedUser });
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white text-sm font-semibold rounded-xl transition ${
                  selectedUser.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {selectedUser.isBlocked ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    Unblock
                  </>
                ) : (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    Block
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── EDIT USER MODAL ── */}
      {showEditUserModal && selectedUser && (
        <Modal
          title="Edit User"
          sub={selectedUser.email}
          onClose={closeModal(setShowEditUserModal)}
        >
          <div className="p-6">
            {editUserSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {editUserSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEditUser}>
                <div className="space-y-4 mb-5">
                  {/* Username / Referral Code - Editable */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Username / Referral Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Hash className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editUserForm.referralCode}
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            referralCode: e.target.value,
                          })
                        }
                        placeholder="Referral code"
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Email - Editable */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={editUserForm.email}
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="Email address"
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editUserForm.firstName}
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="First name"
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editUserForm.lastName}
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Last name"
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={editUserForm.phoneNumber}
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="+234 000 000 0000"
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      User Role
                    </label>
                    <select
                      value={editUserForm.role}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          role: e.target.value,
                        })
                      }
                      className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 bg-gray-50"
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                {editUserError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                    {editUserError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    <Key className="w-3.5 h-3.5" />
                    Change Password
                  </button>
                  <button
                    type="submit"
                    disabled={editUserLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {editUserLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* ── PASSWORD CHANGE MODAL ── */}
      {showPasswordModal && selectedUser && (
        <Modal
          title="Change Password"
          sub={`For: ${selectedUser.email}`}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordError("");
            setPasswordSuccess("");
            setPasswordForm({ newPassword: "", confirmPassword: "" });
          }}
        >
          <div className="p-6">
            {passwordSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {passwordSuccess}
                </p>
                <p className="text-xs text-gray-400">Password updated</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                    {passwordError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError("");
                      setPasswordForm({ newPassword: "", confirmPassword: "" });
                    }}
                    disabled={passwordLoading}
                    className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* ── BANK EDIT MODAL ── */}
      {showBankModal && selectedUser && (
        <Modal
          title="Edit Bank Details"
          sub={selectedUser.email}
          onClose={closeModal(setShowBankModal)}
        >
          <div className="p-6">
            {bankActionSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {bankActionSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBankUpdate}>
                <div className="space-y-4 mb-5">
                  {[
                    {
                      label: "Account Name",
                      key: "accountName",
                      placeholder: "Full account name",
                    },
                    {
                      label: "Account Number",
                      key: "accountNumber",
                      placeholder: "10-digit account number",
                    },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={bankForm[key]}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, [key]: e.target.value })
                        }
                        placeholder={placeholder}
                        required
                        className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                  ))}

                  {/* Bank Name - Now a text input instead of dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Bank Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Building className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={bankForm.bankName}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, bankName: e.target.value })
                        }
                        placeholder="Enter bank name (e.g., Access Bank, GTBank, etc.)"
                        required
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-gray-50"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Enter the full name of the bank
                    </p>
                  </div>

                  {/* lock toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      {bankForm.isLocked ? (
                        <Lock className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Unlock className="w-4 h-4 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {bankForm.isLocked ? "Locked" : "Unlocked"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {bankForm.isLocked
                            ? "User cannot edit"
                            : "User can edit"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setBankForm({
                          ...bankForm,
                          isLocked: !bankForm.isLocked,
                        })
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        bankForm.isLocked ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          bankForm.isLocked
                            ? "translate-x-4.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {bankActionError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                    {bankActionError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBankModal(false)}
                    disabled={bankActionLoading}
                    className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bankActionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {bankActionLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* ── REFERRALS MODAL ── */}
      {showReferralsModal && selectedUser && (
        <Modal
          title="User Referrals"
          sub={`${selectedUser.email} - ${selectedUser.referralCode || "No code"}`}
          onClose={() => {
            setShowReferralsModal(false);
            setReferralsData([]);
          }}
          wide
        >
          <div className="p-6">
            {/* Referral Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center">
                <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-purple-700">
                  {referralsStats.totalReferrals}
                </p>
                <p className="text-[10px] text-purple-600">Total Referrals</p>
              </div>
            </div>

            {/* Referrals List */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Referred Users
            </p>

            {referralsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            ) : referralsData.length > 0 ? (
              <div className="space-y-2">
                {referralsData.map((ref, idx) => (
                  <div
                    key={ref.user?._id || idx}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-purple-200 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {ref.user?.firstName?.[0] ||
                              ref.user?.email?.[0] ||
                              "U"}
                          </div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {ref.user?.referralCode}
                          </p>
                        </div>
                        {ref.user?.email && (
                          <p className="text-[11px] text-gray-500 truncate ml-8">
                            {ref.user.email}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 ml-8">
                          <span className="text-[10px] text-gray-400">
                            Invested: {fmt(ref.investmentAmount || 0)}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Date: {fmtDate(ref.date)}
                          </span>
                        </div>
                      </div>
                      {/* <div className="shrink-0">
                        {ref.bonusPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Bonus Paid
                          </span>
                        ) : ref.investmentAmount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                            <Clock className="w-2.5 h-2.5" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                            No Investment
                          </span>
                        )}
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No referrals yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  This user hasn't referred anyone
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── BLOCK CONFIRM MODAL ── */}
      {blockAction.show && blockAction.user && (
        <Modal
          title={blockAction.user.isBlocked ? "Unblock User" : "Block User"}
          sub={blockAction.user.email}
          onClose={() => setBlockAction({ show: false, user: null })}
        >
          <div className="p-6">
            {actionSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {actionSuccess}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-5">
                  {blockAction.user.isBlocked
                    ? `Unblocking ${blockAction.user.email} will restore their full platform access.`
                    : `Blocking ${blockAction.user.email} will prevent them from logging in or making transactions.`}
                </p>
                {actionError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                    {actionError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setBlockAction({ show: false, user: null });
                      setActionError("");
                    }}
                    disabled={actionLoading}
                    className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleBlock}
                    disabled={actionLoading}
                    className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 ${
                      blockAction.user.isBlocked
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Processing…
                      </span>
                    ) : blockAction.user.isBlocked ? (
                      "Unblock User"
                    ) : (
                      "Block User"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── shared modal shell ── */
const Chip = ({ label, onRemove, color }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ring-current/20 ${color}`}
  >
    {label}
    <button onClick={onRemove}>
      <X className="w-3 h-3" />
    </button>
  </span>
);

const Modal = ({ title, sub, onClose, children, wide }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${wide ? "max-w-lg" : "max-w-sm"} w-full max-h-[90vh] overflow-y-auto`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {sub && (
            <p className="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-[220px]">
              {sub}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);

export default AdminUsers;
