import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Zap,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Info,
  Percent,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  Gift,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { url } from "../../api";

/* ── animation ── */
const stepAnim = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const STEPS = ["Select Plan", "Enter Amount", "Upload Proof", "Confirm"];

/* ═══════════════════════════════════════════════ */
const CreateInvestment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    plan: "",
    amount: "",
    paymentProof: null,
    agreeTerms: false,
  });

  const [settings, setSettings] = useState({
    apex1_min: 10000,
    apex1_max: 500000,
    apex2_min: 20000,
    apex2_max: 1000000,
    apex1_rate: 30,
    apex2_rate: 50,
    investments_enabled: true,
  });

  const [calc, setCalc] = useState({
    expectedReturn: 0,
    profit: 0,
    withdrawals: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${url}settings/public`);
        const s = {};
        res.data.data.settings.forEach((x) => {
          s[x.key] = x.value;
        });
        setSettings(s);
      } catch {
        /* use defaults */
      }
    })();
  }, []);

  useEffect(() => {
    if (!formData.plan || !formData.amount) return;
    const amount = parseFloat(formData.amount) || 0;
    const rate =
      formData.plan === "apex1" ? settings.apex1_rate : settings.apex2_rate;
    const expectedReturn = amount * (1 + rate / 100);
    const numW = formData.plan === "apex1" ? 2 : 3;
    const wAmt = expectedReturn / numW;
    setCalc({
      expectedReturn,
      profit: expectedReturn - amount,
      withdrawals: Array.from({ length: numW }, (_, i) => ({
        phase: i + 1,
        amount: wAmt,
        day: (i + 1) * 5,
      })),
    });
  }, [formData.plan, formData.amount, settings]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setError("");
    if (type === "file") {
      const file = files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowed.includes(file.type)) {
        setError("Only images (JPEG, PNG, GIF) and PDF files are allowed");
        return;
      }
      setFormData((f) => ({ ...f, paymentProof: file }));
      if (file.type.startsWith("image/")) {
        const r = new FileReader();
        r.onloadend = () => setPreviewUrl(r.result);
        r.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      setUploadProgress(0);
      const iv = setInterval(
        () =>
          setUploadProgress((p) => {
            if (p >= 100) {
              clearInterval(iv);
              return 100;
            }
            return p + 10;
          }),
        100,
      );
    } else {
      setFormData((f) => ({
        ...f,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateStep = () => {
    if (step === 1 && !formData.plan) {
      setError("Please select an investment plan");
      return false;
    }
    if (step === 2) {
      const amt = parseFloat(formData.amount);
      const min =
        formData.plan === "apex1" ? settings.apex1_min : settings.apex2_min;
      const max =
        formData.plan === "apex1" ? settings.apex1_max : settings.apex2_max;
      if (!formData.amount) {
        setError("Please enter an amount");
        return false;
      }
      if (amt < min) {
        setError(`Minimum for ${formData.plan.toUpperCase()} is ${fmt(min)}`);
        return false;
      }
      if (amt > max) {
        setError(`Maximum for ${formData.plan.toUpperCase()} is ${fmt(max)}`);
        return false;
      }
    }
    if (step === 3 && !formData.paymentProof) {
      setError("Please upload payment proof");
      return false;
    }
    if (step === 4 && !formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
      setError("");
    }
  };
  const handleBack = () => {
    setStep((s) => s - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${url}investments`,
        { plan: formData.plan, amount: parseFloat(formData.amount) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const investmentId = res.data.data.investment._id;
      if (formData.paymentProof) {
        const fd = new FormData();
        fd.append("proof", formData.paymentProof);
        await axios.post(`${url}investments/${investmentId}/upload-proof`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (p) =>
            setUploadProgress(Math.round((p.loaded * 100) / p.total)),
        });
      }
      setSuccess("Investment created successfully! Redirecting…");
      setTimeout(() => navigate("/investments"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create investment");
    } finally {
      setLoading(false);
    }
  };

  const isApex1 = formData.plan === "apex1";
  const min =
    formData.plan === "apex1" ? settings.apex1_min : settings.apex2_min;
  const max =
    formData.plan === "apex1" ? settings.apex1_max : settings.apex2_max;

  /* ── investments disabled ── */
  if (!settings.investments_enabled)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">
            Investments Temporarily Disabled
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            New investments are temporarily paused by admin. Please check back
            later.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── HEADER ── */}
      <div className="mb-6">
        <Link
          to="/investments"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-semibold transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Investments
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Investment
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Start your investment journey in a few simple steps
        </p>
      </div>

      {/* ── STEPPER ── */}
      <div className="mb-7">
        <div className="flex items-center">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-emerald-500 text-white" : active ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-100 text-gray-400"}`}
                  >
                    {done ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  <p
                    className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${active ? "text-blue-600" : done ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {label}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all ${step > num ? "bg-emerald-400" : "bg-gray-100"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── ALERTS ── */}
      {!user?.hasBankDetails && step > 2 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Bank Details Required
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Add your bank details before you can withdraw funds.
            </p>
            <Link
              to="/profile"
              className="text-xs font-semibold text-amber-800 hover:underline mt-1 inline-block"
            >
              Add Now →
            </Link>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      {/* ── FORM CARD ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* ── STEP 1 ── */}
          {step === 1 && (
            <motion.div key="s1" {...stepAnim}>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-5">
                Select Investment Plan
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    key: "apex1",
                    Icon: Zap,
                    rate: settings.apex1_rate,
                    min: settings.apex1_min,
                    max: settings.apex1_max,
                    dur: "10 working days",
                    payments: "2 phases (50/50)",
                    accent: "blue",
                    border: "border-blue-500",
                    bg: "bg-blue-50",
                    iconActive: "bg-blue-600",
                    iconInactive: "bg-blue-50",
                    check: "text-blue-600",
                  },
                  {
                    key: "apex2",
                    Icon: TrendingUp,
                    rate: settings.apex2_rate,
                    min: settings.apex2_min,
                    max: settings.apex2_max,
                    dur: "15 working days",
                    payments: "3 phases (equal split)",
                    accent: "emerald",
                    border: "border-emerald-500",
                    bg: "bg-emerald-50",
                    iconActive: "bg-emerald-600",
                    iconInactive: "bg-emerald-50",
                    check: "text-emerald-600",
                  },
                ].map((plan) => {
                  const selected = formData.plan === plan.key;
                  return (
                    <div
                      key={plan.key}
                      onClick={() =>
                        setFormData((f) => ({ ...f, plan: plan.key }))
                      }
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-sm ${selected ? `${plan.border} ${plan.bg}` : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${selected ? plan.iconActive : plan.iconInactive}`}
                        >
                          <plan.Icon
                            className={`w-5 h-5 ${selected ? "text-white" : `text-${plan.accent}-600`}`}
                          />
                        </div>
                        {selected && (
                          <CheckCircle className={`w-5 h-5 ${plan.check}`} />
                        )}
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">
                        {plan.key.toUpperCase()}
                      </p>
                      <p
                        className={`text-3xl font-bold text-${plan.accent}-600 mb-4`}
                      >
                        {plan.rate}%
                      </p>
                      <div className="space-y-1.5 text-xs">
                        {[
                          { label: "Min", val: fmt(plan.min) },
                          { label: "Max", val: fmt(plan.max) },
                          { label: "Duration", val: plan.dur },
                          { label: "Payments", val: plan.payments },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-gray-500">{label}</span>
                            <span className="font-semibold text-gray-800">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">
                    Investment Rule
                  </p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    You cannot invest less than your previous investment amount.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.div key="s2" {...stepAnim}>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-5">
                Enter Amount · {formData.plan.toUpperCase()}
              </h2>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Amount (NGN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-semibold">
                      ₦
                    </span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min={min}
                    max={max}
                    className="block w-full pl-9 pr-16 py-4 text-2xl font-bold border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-gray-50"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">NGN</span>
                  </div>
                </div>

                {/* Quick amount buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() =>
                        setFormData((f) => ({ ...f, amount: amt }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${parseFloat(formData.amount) === amt ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {fmt(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limits */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5 text-xs">
                <span className="text-gray-400">
                  Min:{" "}
                  <span className="font-semibold text-gray-700">
                    {fmt(min)}
                  </span>
                </span>
                <div className="w-px h-4 bg-gray-200" />
                <span className="text-gray-400">
                  Max:{" "}
                  <span className="font-semibold text-gray-700">
                    {fmt(max)}
                  </span>
                </span>
              </div>

              {/* Return preview */}
              {formData.amount && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden bg-[#0b0f1a] rounded-2xl p-5"
                >
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-white/50 text-[11px] uppercase tracking-wider mb-3">
                      Return Summary
                    </p>
                    <div className="space-y-2.5">
                      {[
                        {
                          label: "You invest",
                          val: fmt(parseFloat(formData.amount)),
                          color: "text-white",
                        },
                        {
                          label: "Expected return",
                          val: fmt(calc.expectedReturn),
                          color: "text-emerald-400",
                        },
                        {
                          label: "Total profit",
                          val: fmt(calc.profit),
                          color: "text-yellow-400",
                        },
                      ].map(({ label, val, color }) => (
                        <div
                          key={label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-white/50">{label}</span>
                          <span className={`font-bold ${color}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">
                        Withdrawal Schedule
                      </p>
                      {calc.withdrawals.map((w) => (
                        <div
                          key={w.phase}
                          className="flex justify-between text-xs text-white/60 mb-1"
                        >
                          <span>
                            Phase {w.phase} · Day {w.day}
                          </span>
                          <span className="font-semibold text-white">
                            {fmt(w.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <motion.div key="s3" {...stepAnim}>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-5">
                Upload Payment Proof
              </h2>

              {/* Payment instructions */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                <p className="text-sm font-bold text-blue-900 mb-3">
                  Transfer to this account
                </p>
                <div className="bg-white rounded-xl p-4 space-y-2.5">
                  {[
                    { label: "Bank Name", val: "First Bank Nigeria" },
                    { label: "Account Name", val: "Apex Trading Square" },
                    { label: "Account Number", val: "1234567890" },
                    {
                      label: "Amount",
                      val: fmt(parseFloat(formData.amount)),
                      highlight: true,
                    },
                  ].map(({ label, val, highlight }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-gray-400">{label}</span>
                      <span
                        className={`font-semibold ${highlight ? "text-emerald-600 text-sm" : "text-gray-800"}`}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* File upload drop zone */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Upload Screenshot or PDF
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    name="paymentProof"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />

                  {!previewUrl ? (
                    <>
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Drag & drop or{" "}
                        <span className="text-blue-600 font-semibold">
                          browse
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-400">
                        JPEG, PNG, GIF, PDF · Max 5MB
                      </p>
                    </>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Proof preview"
                        className="max-h-44 mx-auto rounded-xl border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((f) => ({ ...f, paymentProof: null }));
                          setPreviewUrl(null);
                          setUploadProgress(0);
                          document.getElementById("file-upload").value = "";
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* PDF filename */}
                  {formData.paymentProof && !previewUrl && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {formData.paymentProof.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                      <span>Uploading…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-400">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Your proof will be reviewed within 24 hours. Investment starts
                  counting after confirmation.
                </span>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <motion.div key="s4" {...stepAnim}>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-5">
                Confirm Investment
              </h2>

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-5 space-y-3">
                {/* Plan */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Plan</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${isApex1 ? "bg-blue-50" : "bg-emerald-50"}`}
                    >
                      {isApex1 ? (
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formData.plan.toUpperCase()}
                    </span>
                  </div>
                </div>

                {[
                  {
                    label: "Amount",
                    val: fmt(parseFloat(formData.amount)),
                    color: "text-gray-800",
                  },
                  {
                    label: "Expected Return",
                    val: fmt(calc.expectedReturn),
                    color: "text-emerald-600",
                  },
                  {
                    label: "Profit",
                    val: fmt(calc.profit),
                    color: "text-blue-600",
                  },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className={`text-sm font-bold ${color}`}>{val}</span>
                  </div>
                ))}

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">
                    Withdrawal Schedule
                  </p>
                  {calc.withdrawals.map((w) => (
                    <div
                      key={w.phase}
                      className="flex justify-between text-xs mb-1.5"
                    >
                      <span className="text-gray-500">
                        Phase {w.phase} · Day {w.day}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {fmt(w.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof */}
              {formData.paymentProof && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {formData.paymentProof.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {(formData.paymentProof.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  I confirm the information is correct and agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    terms and conditions
                  </Link>
                  . I understand investments cannot be cancelled once confirmed.
                </span>
              </label>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    Important
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Your investment starts counting after admin confirms your
                    payment — usually within 24 hours.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── NAV BUTTONS ── */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.agreeTerms}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Confirm Investment
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── HELP ROW ── */}
      <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Quick Reference
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: Gift,
              color: "text-violet-600",
              bg: "bg-violet-50",
              text: "5% referral bonus available",
            },
            {
              icon: Percent,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              text: "3% retrading bonus on reinvestment",
            },
            {
              icon: Calendar,
              color: "text-blue-600",
              bg: "bg-blue-50",
              text: "Withdrawals every 5 working days",
            },
          ].map(({ icon: Icon, color, bg, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <p className="text-xs text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateInvestment;
