import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Users,
  Gift,
  TrendingUp,
  Shield,
  Banknote,
  Ban,
  Play,
  Loader,
  Plus,
  Trash2,
  Award,
  Zap,
  Info,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  MessageCircle,
  Music,
  Globe,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

// Reusable Toggle Component
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40 ${
      checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// Reusable Field Component
const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    {hint && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{hint}</p>
    )}
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  />
);

// Toggle Row Component
const ToggleRow = ({ label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
    <div className="pr-6">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      )}
    </div>
    <Toggle checked={checked} onChange={onChange} disabled={disabled} />
  </div>
);

// Section Card Component
const Section = ({
  title,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50 dark:bg-blue-900/30",
  children,
  action,
}) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/50">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// Save Button Component
const SaveButton = ({ onClick, saving, label }) => (
  <div className="flex justify-end pt-2">
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-60 shadow-sm"
    >
      {saving ? (
        <>
          <Loader className="w-3.5 h-3.5 animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </button>
  </div>
);

// Social Media Input Component
const SocialInput = ({
  icon: Icon,
  platform,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </div>
    <div className="flex-1">
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(platform, e.target.value)}
        placeholder={placeholder || `https://${platform}.com/username`}
      />
    </div>
  </div>
);

// Main AdminSettings Component
const AdminSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Separate toggle states
  const [investmentWithdrawalsEnabled, setInvestmentWithdrawalsEnabled] =
    useState(true);
  const [bonusWithdrawalsEnabled, setBonusWithdrawalsEnabled] = useState(true);
  const [togglingInvestment, setTogglingInvestment] = useState(false);
  const [togglingBonus, setTogglingBonus] = useState(false);

  // Social media state
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    telegram: "",
    whatsapp: "",
    tiktok: "",
  });

  const [generalForm, setGeneralForm] = useState({
    siteName: "Apex Trading Square",
    siteUrl: "",
    supportEmail: "",
    supportPhone: "",
    supportHours: "24/7",
    maintenanceMode: false,
  });

  const [investmentForm, setInvestmentForm] = useState({
    apex1_min: 10000,
    apex1_max: 500000,
    apex1_rate: 30,
    apex2_min: 20000,
    apex2_max: 1000000,
    apex2_rate: 50,
    investments_enabled: true,
    workingDaysOnly: true,
  });

  const [withdrawalForm, setWithdrawalForm] = useState({
    min_investment_withdrawal: 10000,
    min_bonus_withdrawal: 10000,
  });

  const [bonusForm, setBonusForm] = useState({
    referral_bonus_rate: 5,
    retrading_bonus_rate: 3,
    referralBonusEnabled: true,
    retradingBonusEnabled: true,
  });

  const [bankAccounts, setBankAccounts] = useState([]);

  const [securityForm, setSecurityForm] = useState({
    twoFactorRequired: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    emailVerification: true,
    adminApprovalRequired: false,
  });

  const fetchSettings = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch all settings in parallel
      const [
        settingsRes,
        withdrawalTogglesRes,
        withdrawalMinimumsRes,
        socialMediaRes,
      ] = await Promise.all([
        axios.get(`${url}admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}admin/withdrawal-toggles-status`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}admin/withdrawal-minimums`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${url}admin/social-media`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const data = settingsRes.data.data.settings;
      const obj = {};
      data.forEach((s) => {
        obj[s.key] = s.value;
      });

      // Set withdrawal toggles
      setInvestmentWithdrawalsEnabled(
        withdrawalTogglesRes.data.data.investmentWithdrawalsEnabled,
      );
      setBonusWithdrawalsEnabled(
        withdrawalTogglesRes.data.data.bonusWithdrawalsEnabled,
      );

      // Set withdrawal minimums
      setWithdrawalForm({
        min_investment_withdrawal:
          withdrawalMinimumsRes.data.data.minInvestmentWithdrawal || 10000,
        min_bonus_withdrawal:
          withdrawalMinimumsRes.data.data.minBonusWithdrawal || 10000,
      });

      // Set social media
      if (socialMediaRes.data.data.socialMedia) {
        setSocialMedia(socialMediaRes.data.data.socialMedia);
      }

      populateForms(obj);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 403) navigate("/dashboard");
      else setError(err.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const populateForms = (data) => {
    setGeneralForm({
      siteName: data.siteName || "Apex Trading Square",
      siteUrl: data.siteUrl || window.location.origin,
      supportEmail: data.supportEmail || "",
      supportPhone: data.supportPhone || "",
      supportHours: data.supportHours || "24/7",
      maintenanceMode: data.maintenanceMode || false,
    });

    setInvestmentForm({
      apex1_min: data.apex1_min || 10000,
      apex1_max: data.apex1_max || 500000,
      apex1_rate: data.apex1_rate || 30,
      apex2_min: data.apex2_min || 20000,
      apex2_max: data.apex2_max || 1000000,
      apex2_rate: data.apex2_rate || 50,
      investments_enabled:
        data.investments_enabled !== undefined
          ? data.investments_enabled
          : true,
      workingDaysOnly:
        data.workingDaysOnly !== undefined ? data.workingDaysOnly : true,
    });

    setBonusForm({
      referral_bonus_rate: data.referral_bonus_rate || 5,
      retrading_bonus_rate: data.retrading_bonus_rate || 3,
      referralBonusEnabled:
        data.referralBonusEnabled !== undefined
          ? data.referralBonusEnabled
          : true,
      retradingBonusEnabled:
        data.retradingBonusEnabled !== undefined
          ? data.retradingBonusEnabled
          : true,
    });

    setBankAccounts(
      data.bankAccounts || [
        {
          bankName: "First Bank Nigeria",
          accountName: "Apex Trading Square",
          accountNumber: "1234567890",
          bankCode: "011",
          swiftCode: "FBNINGLA",
          isDefault: true,
        },
      ],
    );

    setSecurityForm({
      twoFactorRequired: data.twoFactorRequired || false,
      sessionTimeout: data.sessionTimeout || 30,
      maxLoginAttempts: data.maxLoginAttempts || 5,
      emailVerification:
        data.emailVerification !== undefined ? data.emailVerification : true,
      adminApprovalRequired: data.adminApprovalRequired || false,
    });
  };

  const saveGeneralSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/settings`, generalForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("General settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save general settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveInvestmentSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/settings`, investmentForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Investment settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save investment settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveWithdrawalSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/withdrawal-minimums`, withdrawalForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Withdrawal settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save withdrawal settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveBonusSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/settings`, bonusForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Bonus settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save bonus settings");
    } finally {
      setSaving(false);
    }
  };

  const saveBankSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${url}admin/settings`,
        { bankAccounts },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSuccess("Bank details saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save bank details");
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/settings`, securityForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Security settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save security settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveSocialMediaSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/social-media`, socialMedia, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Social media settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save social media settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia({
      ...socialMedia,
      [platform]: value,
    });
  };

  const toggleInvestments = async () => {
    try {
      const token = localStorage.getItem("token");
      const next = !investmentForm.investments_enabled;
      await axios.post(
        `${url}admin/toggle-investments`,
        { enabled: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setInvestmentForm({ ...investmentForm, investments_enabled: next });
      setSuccess(`Investments ${next ? "enabled" : "disabled"} successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle investments");
    }
  };

  const toggleInvestmentWithdrawals = async () => {
    setTogglingInvestment(true);
    try {
      const token = localStorage.getItem("token");
      const next = !investmentWithdrawalsEnabled;
      await axios.post(
        `${url}admin/toggle-investment-withdrawals`,
        { enabled: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setInvestmentWithdrawalsEnabled(next);
      setSuccess(
        `Investment withdrawals ${next ? "enabled" : "disabled"} successfully!`,
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to toggle investment withdrawals",
      );
    } finally {
      setTogglingInvestment(false);
    }
  };

  const toggleBonusWithdrawals = async () => {
    setTogglingBonus(true);
    try {
      const token = localStorage.getItem("token");
      const next = !bonusWithdrawalsEnabled;
      await axios.post(
        `${url}admin/toggle-bonus-withdrawals`,
        { enabled: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBonusWithdrawalsEnabled(next);
      setSuccess(
        `Bonus withdrawals ${next ? "enabled" : "disabled"} successfully!`,
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to toggle bonus withdrawals",
      );
    } finally {
      setTogglingBonus(false);
    }
  };

  const updateBankAccount = (index, field, value) => {
    const updated = [...bankAccounts];
    updated[index][field] = value;
    setBankAccounts(updated);
  };

  const addBankAccount = () =>
    setBankAccounts([
      ...bankAccounts,
      {
        bankName: "",
        accountName: "",
        accountNumber: "",
        bankCode: "",
        swiftCode: "",
        isDefault: false,
      },
    ]);

  const removeBankAccount = (i) => {
    if (bankAccounts.length > 1)
      setBankAccounts(bankAccounts.filter((_, idx) => idx !== i));
  };

  const setDefaultBank = (i) =>
    setBankAccounts(
      bankAccounts.map((a, idx) => ({ ...a, isDefault: idx === i })),
    );

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "investment", label: "Investment", icon: TrendingUp },
    { id: "withdrawal", label: "Withdrawal", icon: DollarSign },
    { id: "bonuses", label: "Bonuses", icon: Gift },
    { id: "social", label: "Social Media", icon: Globe },
    { id: "bank", label: "Bank details", icon: Banknote },
    { id: "security", label: "Security", icon: Shield },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Loading settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-gray-900/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Configure and manage all platform settings
            </p>
          </div>
          <button
            onClick={() => fetchSettings(true)}
            disabled={refreshing}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout: sidebar + content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-52 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                    activeTab === id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      activeTab === id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  {label}
                  {activeTab === id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </nav>

            {/* Quick stats */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Quick overview
              </p>
              {[
                {
                  label: "Apex 1 rate",
                  value: `${investmentForm.apex1_rate}%`,
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  label: "Apex 2 rate",
                  value: `${investmentForm.apex2_rate}%`,
                  color: "text-teal-600 dark:text-teal-400",
                },
                {
                  label: "Referral bonus",
                  value: `${bonusForm.referral_bonus_rate}%`,
                  color: "text-purple-600 dark:text-purple-400",
                },
                {
                  label: "Retrading bonus",
                  value: `${bonusForm.retrading_bonus_rate}%`,
                  color: "text-amber-600 dark:text-amber-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {s.label}
                  </span>
                  <span className={`text-sm font-bold ${s.color}`}>
                    {s.value}
                  </span>
                </div>
              ))}
              <div className="pt-1 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Investments
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      investmentForm.investments_enabled
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {investmentForm.investments_enabled ? "Active" : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Investment WD
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      investmentWithdrawalsEnabled
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {investmentWithdrawalsEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Bonus WD
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      bonusWithdrawalsEnabled
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {bonusWithdrawalsEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 sm:p-6 space-y-5"
              >
                {/* General Tab */}
                {activeTab === "general" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      General settings
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Site name">
                        <Input
                          value={generalForm.siteName}
                          onChange={(e) =>
                            setGeneralForm({
                              ...generalForm,
                              siteName: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Site URL">
                        <Input
                          type="url"
                          value={generalForm.siteUrl}
                          onChange={(e) =>
                            setGeneralForm({
                              ...generalForm,
                              siteUrl: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Support email">
                        <Input
                          type="email"
                          value={generalForm.supportEmail}
                          onChange={(e) =>
                            setGeneralForm({
                              ...generalForm,
                              supportEmail: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Support phone">
                        <Input
                          value={generalForm.supportPhone}
                          onChange={(e) =>
                            setGeneralForm({
                              ...generalForm,
                              supportPhone: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Support hours" className="sm:col-span-2">
                        <Input
                          value={generalForm.supportHours}
                          onChange={(e) =>
                            setGeneralForm({
                              ...generalForm,
                              supportHours: e.target.value,
                            })
                          }
                          placeholder="e.g. 24/7 or Mon–Fri 9am–5pm"
                        />
                      </Field>
                    </div>
                    <ToggleRow
                      label="Maintenance mode"
                      description="When enabled, only admins can access the site"
                      checked={generalForm.maintenanceMode}
                      onChange={() =>
                        setGeneralForm({
                          ...generalForm,
                          maintenanceMode: !generalForm.maintenanceMode,
                        })
                      }
                    />
                    <SaveButton
                      onClick={saveGeneralSettings}
                      saving={saving}
                      label="Save general settings"
                    />
                  </>
                )}

                {/* Investment Tab */}
                {activeTab === "investment" && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Investment settings
                      </h2>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          New Investments
                        </span>
                        <Toggle
                          checked={investmentForm.investments_enabled}
                          onChange={toggleInvestments}
                        />
                      </div>
                    </div>

                    <Section
                      title="Apex 1 plan"
                      icon={Zap}
                      iconColor="text-blue-600"
                      iconBg="bg-blue-50 dark:bg-blue-900/30"
                    >
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Field label="Min amount (NGN)">
                          <Input
                            type="number"
                            value={investmentForm.apex1_min}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                apex1_min: parseInt(e.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Max amount (NGN)">
                          <Input
                            type="number"
                            value={investmentForm.apex1_max}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                apex1_max: parseInt(e.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Return rate (%)">
                          <Input
                            type="number"
                            value={investmentForm.apex1_rate}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                apex1_rate: parseInt(e.target.value),
                              })
                            }
                          />
                        </Field>
                      </div>
                    </Section>

                    <Section
                      title="Apex 2 plan"
                      icon={TrendingUp}
                      iconColor="text-teal-600"
                      iconBg="bg-teal-50 dark:bg-teal-900/30"
                    >
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Field label="Min amount (NGN)">
                          <Input
                            type="number"
                            value={investmentForm.apex2_min}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                apex2_min: parseInt(e.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Max amount (NGN)">
                          <Input
                            type="number"
                            value={investmentForm.apex2_max}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                apex2_max: parseInt(e.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Return rate (%)">
                          <Input
                            type="number"
                            value={investmentForm.apex2_rate}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                apex2_rate: parseInt(e.target.value),
                              })
                            }
                          />
                        </Field>
                      </div>
                    </Section>

                    {/* <Section
                      title="General rules"
                      icon={Settings}
                      iconColor="text-gray-600"
                      iconBg="bg-gray-100 dark:bg-gray-700"
                    >
                      <div className="space-y-4">
                        <ToggleRow
                          label="Count working days only"
                          description="Exclude weekends from investment duration"
                          checked={investmentForm.workingDaysOnly}
                          onChange={() =>
                            setInvestmentForm({
                              ...investmentForm,
                              workingDaysOnly: !investmentForm.workingDaysOnly,
                            })
                          }
                        />
                      </div>
                    </Section> */}

                    <SaveButton
                      onClick={saveInvestmentSettings}
                      saving={saving}
                      label="Save investment settings"
                    />
                  </>
                )}

                {/* Withdrawal Tab */}
                {activeTab === "withdrawal" && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Withdrawal settings
                      </h2>
                    </div>

                    {/* Investment Withdrawal Toggle */}
                    <Section
                      title="Investment Withdrawals"
                      icon={DollarSign}
                      iconColor="text-blue-600"
                      iconBg="bg-blue-50 dark:bg-blue-900/30"
                      action={
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Enable</span>
                          <Toggle
                            checked={investmentWithdrawalsEnabled}
                            onChange={toggleInvestmentWithdrawals}
                            disabled={togglingInvestment}
                          />
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        {/* <Field label="Minimum investment withdrawal amount (NGN)">
                          <Input
                            type="number"
                            value={withdrawalForm.min_investment_withdrawal}
                            onChange={(e) =>
                              setWithdrawalForm({
                                ...withdrawalForm,
                                min_investment_withdrawal: parseInt(
                                  e.target.value,
                                ),
                              })
                            }
                            className="max-w-xs"
                            disabled={!investmentWithdrawalsEnabled}
                          />
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Users cannot request investment withdrawals below
                            this amount
                          </p>
                        </Field> */}
                        {!investmentWithdrawalsEnabled && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                              <Info className="w-3.5 h-3.5" />
                              Investment withdrawals are currently disabled.
                              Users cannot request new investment withdrawals.
                            </p>
                          </div>
                        )}
                      </div>
                    </Section>

                    {/* Bonus Withdrawal Toggle */}
                    <Section
                      title="Bonus Withdrawals"
                      icon={Gift}
                      iconColor="text-purple-600"
                      iconBg="bg-purple-50 dark:bg-purple-900/30"
                      action={
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Enable</span>
                          <Toggle
                            checked={bonusWithdrawalsEnabled}
                            onChange={toggleBonusWithdrawals}
                            disabled={togglingBonus}
                          />
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        <Field label="Minimum bonus withdrawal amount (NGN)">
                          <Input
                            type="number"
                            value={withdrawalForm.min_bonus_withdrawal}
                            onChange={(e) =>
                              setWithdrawalForm({
                                ...withdrawalForm,
                                min_bonus_withdrawal: parseInt(e.target.value),
                              })
                            }
                            className="max-w-xs"
                            disabled={!bonusWithdrawalsEnabled}
                          />
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Users cannot withdraw bonuses below this amount
                          </p>
                        </Field>
                        {!bonusWithdrawalsEnabled && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                              <Info className="w-3.5 h-3.5" />
                              Bonus withdrawals are currently disabled. Users
                              cannot request new bonus withdrawals.
                            </p>
                          </div>
                        )}
                      </div>
                    </Section>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Investment WD Status
                        </p>
                        <p
                          className={`text-sm font-semibold ${investmentWithdrawalsEnabled ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {investmentWithdrawalsEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Min: {fmt(withdrawalForm.min_investment_withdrawal)}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Bonus WD Status
                        </p>
                        <p
                          className={`text-sm font-semibold ${bonusWithdrawalsEnabled ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {bonusWithdrawalsEnabled ? "Enabled" : "Disabled"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Min: {fmt(withdrawalForm.min_bonus_withdrawal)}
                        </p>
                      </div>
                    </div>

                    <SaveButton
                      onClick={saveWithdrawalSettings}
                      saving={saving}
                      label="Save withdrawal settings"
                    />
                  </>
                )}

                {/* Bonuses Tab */}
                {activeTab === "bonuses" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Bonus settings
                    </h2>

                    <Section
                      title="Referral bonus"
                      icon={Users}
                      iconColor="text-blue-600"
                      iconBg="bg-blue-50 dark:bg-blue-900/30"
                      action={
                        <Toggle
                          checked={bonusForm.referralBonusEnabled}
                          onChange={() =>
                            setBonusForm({
                              ...bonusForm,
                              referralBonusEnabled:
                                !bonusForm.referralBonusEnabled,
                            })
                          }
                        />
                      }
                    >
                      <Field label="Referral bonus rate (%)">
                        <Input
                          type="number"
                          value={bonusForm.referral_bonus_rate}
                          onChange={(e) =>
                            setBonusForm({
                              ...bonusForm,
                              referral_bonus_rate: parseInt(e.target.value),
                            })
                          }
                          disabled={!bonusForm.referralBonusEnabled}
                          className="max-w-xs"
                        />
                      </Field>
                    </Section>

                    <Section
                      title="Retrading bonus"
                      icon={TrendingUp}
                      iconColor="text-purple-600"
                      iconBg="bg-purple-50 dark:bg-purple-900/30"
                      action={
                        <Toggle
                          checked={bonusForm.retradingBonusEnabled}
                          onChange={() =>
                            setBonusForm({
                              ...bonusForm,
                              retradingBonusEnabled:
                                !bonusForm.retradingBonusEnabled,
                            })
                          }
                        />
                      }
                    >
                      <Field label="Retrading bonus rate (%)">
                        <Input
                          type="number"
                          value={bonusForm.retrading_bonus_rate}
                          onChange={(e) =>
                            setBonusForm({
                              ...bonusForm,
                              retrading_bonus_rate: parseInt(e.target.value),
                            })
                          }
                          disabled={!bonusForm.retradingBonusEnabled}
                          className="max-w-xs"
                        />
                      </Field>
                    </Section>

                    <SaveButton
                      onClick={saveBonusSettings}
                      saving={saving}
                      label="Save bonus settings"
                    />
                  </>
                )}

                {/* Social Media Tab */}
                {activeTab === "social" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Social Media Settings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
                      Add your social media links to display on the website
                    </p>

                    <div className="space-y-4">
                      <SocialInput
                        icon={Facebook}
                        platform="facebook"
                        value={socialMedia.facebook}
                        onChange={handleSocialMediaChange}
                        placeholder="https://facebook.com/yourpage"
                      />

                      <SocialInput
                        icon={Twitter}
                        platform="twitter"
                        value={socialMedia.twitter}
                        onChange={handleSocialMediaChange}
                        placeholder="https://twitter.com/yourhandle"
                      />

                      <SocialInput
                        icon={Instagram}
                        platform="instagram"
                        value={socialMedia.instagram}
                        onChange={handleSocialMediaChange}
                        placeholder="https://instagram.com/yourusername"
                      />

                      <SocialInput
                        icon={Linkedin}
                        platform="linkedin"
                        value={socialMedia.linkedin}
                        onChange={handleSocialMediaChange}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />

                      <SocialInput
                        icon={Youtube}
                        platform="youtube"
                        value={socialMedia.youtube}
                        onChange={handleSocialMediaChange}
                        placeholder="https://youtube.com/c/yourchannel"
                      />

                      <SocialInput
                        icon={Send}
                        platform="telegram"
                        value={socialMedia.telegram}
                        onChange={handleSocialMediaChange}
                        placeholder="https://t.me/yourusername"
                      />

                      <SocialInput
                        icon={MessageCircle}
                        platform="whatsapp"
                        value={socialMedia.whatsapp}
                        onChange={handleSocialMediaChange}
                        placeholder="https://wa.me/1234567890"
                      />

                      <SocialInput
                        icon={Music}
                        platform="tiktok"
                        value={socialMedia.tiktok}
                        onChange={handleSocialMediaChange}
                        placeholder="https://tiktok.com/@yourusername"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                      <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        Leave fields empty to hide the social media icon. All
                        links will open in a new tab.
                      </p>
                    </div>

                    <SaveButton
                      onClick={saveSocialMediaSettings}
                      saving={saving}
                      label="Save social media settings"
                    />
                  </>
                )}

                {/* Bank Tab */}
                {activeTab === "bank" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Bank details
                    </h2>

                    <div className="space-y-4">
                      {bankAccounts.map((account, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/50">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <Banknote className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                Account {index + 1}
                              </span>
                              {account.isDefault && (
                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full ring-1 ring-blue-200 dark:ring-blue-800">
                                  Default
                                </span>
                              )}
                            </div>
                            {!account.isDefault && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setDefaultBank(index)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                                  title="Set as default"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeBankAccount(index)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="p-5 grid sm:grid-cols-2 gap-4">
                            <Field label="Bank name">
                              <Input
                                value={account.bankName}
                                onChange={(e) =>
                                  updateBankAccount(
                                    index,
                                    "bankName",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Account name">
                              <Input
                                value={account.accountName}
                                onChange={(e) =>
                                  updateBankAccount(
                                    index,
                                    "accountName",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Account number">
                              <Input
                                value={account.accountNumber}
                                onChange={(e) =>
                                  updateBankAccount(
                                    index,
                                    "accountNumber",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Bank code">
                              <Input
                                value={account.bankCode}
                                onChange={(e) =>
                                  updateBankAccount(
                                    index,
                                    "bankCode",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Swift code (optional)">
                              <Input
                                value={account.swiftCode || ""}
                                onChange={(e) =>
                                  updateBankAccount(
                                    index,
                                    "swiftCode",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={addBankAccount}
                        className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add another bank account
                      </button>
                    </div>

                    <SaveButton
                      onClick={saveBankSettings}
                      saving={saving}
                      label="Save bank details"
                    />
                  </>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Security settings
                    </h2>

                    <div className="space-y-3">
                      <ToggleRow
                        label="Two-factor authentication"
                        description="Require 2FA for all admin accounts"
                        checked={securityForm.twoFactorRequired}
                        onChange={() =>
                          setSecurityForm({
                            ...securityForm,
                            twoFactorRequired: !securityForm.twoFactorRequired,
                          })
                        }
                      />
                      <ToggleRow
                        label="Email verification"
                        description="Require email verification for new registrations"
                        checked={securityForm.emailVerification}
                        onChange={() =>
                          setSecurityForm({
                            ...securityForm,
                            emailVerification: !securityForm.emailVerification,
                          })
                        }
                      />
                      <ToggleRow
                        label="Admin approval required"
                        description="New users require admin approval before accessing platform"
                        checked={securityForm.adminApprovalRequired}
                        onChange={() =>
                          setSecurityForm({
                            ...securityForm,
                            adminApprovalRequired:
                              !securityForm.adminApprovalRequired,
                          })
                        }
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <Field label="Session timeout (minutes)">
                        <Input
                          type="number"
                          value={securityForm.sessionTimeout}
                          onChange={(e) =>
                            setSecurityForm({
                              ...securityForm,
                              sessionTimeout: parseInt(e.target.value),
                            })
                          }
                        />
                      </Field>
                      <Field label="Max login attempts">
                        <Input
                          type="number"
                          value={securityForm.maxLoginAttempts}
                          onChange={(e) =>
                            setSecurityForm({
                              ...securityForm,
                              maxLoginAttempts: parseInt(e.target.value),
                            })
                          }
                        />
                      </Field>
                    </div>

                    <SaveButton
                      onClick={saveSecuritySettings}
                      saving={saving}
                      label="Save security settings"
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
