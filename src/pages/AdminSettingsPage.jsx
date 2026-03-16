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
  Wallet,
  Banknote,
  Mail,
  Phone,
  Globe,
  Award,
  Zap,
  Loader,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

// ── Reusable Toggle ───────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40 ${
      checked ? "bg-blue-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// ── Reusable Field ────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  />
);

// ── Toggle Row ────────────────────────────────────────────────────────────────
const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50 rounded-xl border border-gray-100">
    <div className="pr-6">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

// ── Section Card ─────────────────────────────────────────────────────────────
const Section = ({
  title,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  children,
  action,
}) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ── Save Button ───────────────────────────────────────────────────────────────
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

// ═════════════════════════════════════════════════════════════════════════════
const AdminSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

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
    minWithdrawal: 10000,
  });

  const [bonusForm, setBonusForm] = useState({
    referral_bonus_rate: 5,
    retrading_bonus_rate: 3,
    min_bonus_withdrawal: 10000,
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
      const response = await axios.get(`${url}admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data.settings;
      const obj = {};
      data.forEach((s) => {
        obj[s.key] = s.value;
      });
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
      minWithdrawal: data.minWithdrawal || 10000,
    });
    setBonusForm({
      referral_bonus_rate: data.referral_bonus_rate || 5,
      retrading_bonus_rate: data.retrading_bonus_rate || 3,
      min_bonus_withdrawal: data.min_bonus_withdrawal || 10000,
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

  const save = async (formData, label) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${url}admin/settings`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`${label} saved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to save ${label.toLowerCase()}`,
      );
    } finally {
      setSaving(false);
    }
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
    { id: "bonuses", label: "Bonuses", icon: Gift },
    { id: "bank", label: "Bank details", icon: Banknote },
    { id: "security", label: "Security", icon: Shield },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure and manage all platform settings
            </p>
          </div>
          <button
            onClick={() => fetchSettings(true)}
            disabled={refreshing}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* ── Alerts ── */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Layout: sidebar + content ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-52 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-b border-gray-100 last:border-0 ${
                    activeTab === id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${activeTab === id ? "text-blue-600" : "text-gray-400"}`}
                  />
                  {label}
                  {activeTab === id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </nav>

            {/* Quick stats */}
            <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quick overview
              </p>
              {[
                {
                  label: "Apex 1 rate",
                  value: `${investmentForm.apex1_rate}%`,
                  color: "text-blue-600",
                },
                {
                  label: "Apex 2 rate",
                  value: `${investmentForm.apex2_rate}%`,
                  color: "text-teal-600",
                },
                {
                  label: "Referral bonus",
                  value: `${bonusForm.referral_bonus_rate}%`,
                  color: "text-purple-600",
                },
                {
                  label: "Retrading bonus",
                  value: `${bonusForm.retrading_bonus_rate}%`,
                  color: "text-amber-600",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>
                    {s.value}
                  </span>
                </div>
              ))}
              <div className="pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Investments</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${investmentForm.investments_enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {investmentForm.investments_enabled ? "Active" : "Off"}
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
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-5"
              >
                {/* ── General ── */}
                {activeTab === "general" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900">
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
                      onClick={() => save(generalForm, "General settings")}
                      saving={saving}
                      label="Save general settings"
                    />
                  </>
                )}

                {/* ── Investment ── */}
                {activeTab === "investment" && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-gray-900">
                        Investment settings
                      </h2>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-gray-500">
                          Investments
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
                      iconBg="bg-blue-50"
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
                      iconBg="bg-teal-50"
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

                    <Section
                      title="General rules"
                      icon={Settings}
                      iconColor="text-gray-600"
                      iconBg="bg-gray-100"
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
                        <Field label="Min withdrawal amount (NGN)">
                          <Input
                            type="number"
                            value={investmentForm.minWithdrawal}
                            onChange={(e) =>
                              setInvestmentForm({
                                ...investmentForm,
                                minWithdrawal: parseInt(e.target.value),
                              })
                            }
                            className="max-w-xs"
                          />
                        </Field>
                      </div>
                    </Section>

                    <SaveButton
                      onClick={() =>
                        save(investmentForm, "Investment settings")
                      }
                      saving={saving}
                      label="Save investment settings"
                    />
                  </>
                )}

                {/* ── Bonuses ── */}
                {activeTab === "bonuses" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900">
                      Bonus settings
                    </h2>

                    <Section
                      title="Referral bonus"
                      icon={Users}
                      iconColor="text-blue-600"
                      iconBg="bg-blue-50"
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
                      iconBg="bg-purple-50"
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

                    <Section
                      title="General bonus rules"
                      icon={Gift}
                      iconColor="text-amber-600"
                      iconBg="bg-amber-50"
                    >
                      <Field label="Min bonus withdrawal (NGN)">
                        <Input
                          type="number"
                          value={bonusForm.min_bonus_withdrawal}
                          onChange={(e) =>
                            setBonusForm({
                              ...bonusForm,
                              min_bonus_withdrawal: parseInt(e.target.value),
                            })
                          }
                          className="max-w-xs"
                        />
                      </Field>
                    </Section>

                    <SaveButton
                      onClick={() => save(bonusForm, "Bonus settings")}
                      saving={saving}
                      label="Save bonus settings"
                    />
                  </>
                )}

                {/* ── Bank ── */}
                {activeTab === "bank" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900">
                      Bank details
                    </h2>

                    <div className="space-y-4">
                      {bankAccounts.map((account, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Banknote className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                Account {index + 1}
                              </span>
                              {account.isDefault && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full ring-1 ring-blue-200">
                                  Default
                                </span>
                              )}
                            </div>
                            {!account.isDefault && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setDefaultBank(index)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="Set as default"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeBankAccount(index)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
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
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add another bank account
                      </button>
                    </div>

                    <SaveButton
                      onClick={() => save({ bankAccounts }, "Bank details")}
                      saving={saving}
                      label="Save bank details"
                    />
                  </>
                )}

                {/* ── Security ── */}
                {activeTab === "security" && (
                  <>
                    <h2 className="text-base font-semibold text-gray-900">
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
                      onClick={() => save(securityForm, "Security settings")}
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
