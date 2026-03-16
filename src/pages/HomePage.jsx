import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Gift,
  Clock,
  CheckCircle,
  Copy,
  ChevronRight,
  Star,
  Award,
  BarChart3,
  Wallet,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  Sparkles,
  DollarSign,
  Calendar,
} from "lucide-react";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── data ────────────────────────────────────────────────────────────────────
const packages = [
  {
    id: "apex1",
    name: "APEX 1",
    accent: "#2563EB",
    accentLight: "#EFF6FF",
    accentMid: "#BFDBFE",
    icon: Zap,
    returnRate: 30, // Changed to number
    duration: "10 working days",
    payments: "2 payments · 50% each",
    minAmount: 10000, // Changed to number
    maxAmount: 500000, // Changed to number
    features: [
      "Perfect entry point",
      "Returns in 10 working days",
      "50% payout every 5 days",
      "Low minimum capital",
    ],
    highlight: false,
  },
  {
    id: "apex2",
    name: "APEX 2",
    accent: "#059669",
    accentLight: "#ECFDF5",
    accentMid: "#A7F3D0",
    icon: TrendingUp,
    returnRate: 50, // Changed to number
    duration: "15 working days",
    payments: "3 equal payments",
    minAmount: 20000, // Changed to number
    maxAmount: 1000000, // Changed to number
    features: [
      "Maximum return potential",
      "3 staggered withdrawals",
      "Ideal for serious investors",
      "Higher capital ceiling",
    ],
    highlight: true,
    badge: "Most popular",
  },
];

const features = [
  {
    icon: Shield,
    title: "Bank-grade security",
    desc: "256-bit encryption protects every transaction and your personal data.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Zap,
    title: "Fast withdrawals",
    desc: "Automated payouts every 5 working days, no waiting, no friction.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    icon: Gift,
    title: "Referral bonuses",
    desc: "Earn 5% one-time bonus every time a friend you refer invests.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: TrendingUp,
    title: "Retrading bonus",
    desc: "Reinvest before full payout and receive an extra 3% on your new amount.",
    color: "#EA580C",
    bg: "#FFF7ED",
  },
  {
    icon: Users,
    title: "Growing community",
    desc: "Over 15,000 active investors building wealth on the platform.",
    color: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    icon: Clock,
    title: "24/7 support",
    desc: "Our team is available around the clock to assist with any questions.",
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
];

const steps = [
  {
    n: "01",
    title: "Create account",
    desc: "Sign up with your email and receive your unique referral link instantly.",
    icon: Users,
  },
  {
    n: "02",
    title: "Pick a package",
    desc: "Choose between APEX 1 and APEX 2 based on your investment goals.",
    icon: Award,
  },
  {
    n: "03",
    title: "Make payment",
    desc: "Transfer funds and upload your proof for admin confirmation.",
    icon: Wallet,
  },
  {
    n: "04",
    title: "Collect returns",
    desc: "Watch your capital grow and withdraw profits on schedule.",
    icon: BarChart3,
  },
];

const testimonials = [
  {
    name: "Oluwaseun A.",
    location: "Lagos",
    initials: "OA",
    bg: "#2563EB",
    investment: "APEX 2 · ₦500k",
    profit: "₦750,000",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Made more in 15 days than three months of regular trading. The staggered withdrawal schedule is brilliant.",
  },
  {
    name: "Chioma M.",
    location: "Abuja",
    initials: "CM",
    bg: "#059669",
    investment: "APEX 1 · ₦200k",
    profit: "₦260,000",
    rating: 5,
    date: "1 month ago",
    comment:
      "Started with Apex 1 to test the waters. Got my first 50% in 5 days and immediately reinvested for the bonus.",
  },
  {
    name: "Ahmed K.",
    location: "Kano",
    initials: "AK",
    bg: "#7C3AED",
    investment: "APEX 2 · ₦1M",
    profit: "₦1,500,000",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "The referral system alone has earned me over ₦250k on top of my investment returns. Incredible platform.",
  },
];

const faqs = [
  {
    q: "How do working days work?",
    a: "We count weekdays only (Mon–Fri). Weekends are excluded from your investment duration. If you invest on Friday, Day 1 begins the following Monday.",
  },
  {
    q: "Can I withdraw before the full term?",
    a: "Withdrawals are scheduled every 5 working days per your package phase. You can only withdraw when each phase completes.",
  },
  {
    q: "How do I earn the retrading bonus?",
    a: "Reinvest before fully withdrawing your previous investment and you automatically receive a 3% bonus on the new amount.",
  },
  {
    q: "What if my payment proof is declined?",
    a: "Admin reviews all proofs within 24 hours. If declined, you'll be notified with a reason and can resubmit the correct proof.",
  },
  {
    q: "Can I change my bank details later?",
    a: "Bank details are locked after the first save for security. Contact admin support directly to request changes.",
  },
  {
    q: "Is there a minimum for bonus withdrawals?",
    a: "Yes — you need at least ₦10,000 in combined referral and retrading bonuses before you can withdraw them.",
  },
];

// ─── component ───────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("APEX 1");
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [customAmount, setCustomAmount] = useState("100,000");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    activeInvestments: 0,
  });
  const [statsReady, setStatsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 15420,
        totalInvested: 1250000000,
        totalWithdrawn: 875000000,
        activeInvestments: 8321,
      });
      setStatsReady(true);
    }, 1200);
  }, []);

  // Handle hash scroll on initial load
  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    handleInitialScroll();
  }, []);

  // Starfield canvas animation
  useEffect(() => {
    const c = document.getElementById("starfield");
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      o: Math.random() * 0.65 + 0.15,
      speed: Math.random() * 0.004 + 0.001,
      t: Math.random() * Math.PI * 2,
    }));
    const blooms = Array.from({ length: 10 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.75,
      r: Math.random() * 2 + 1.5,
      o: Math.random() * 0.35 + 0.15,
      speed: Math.random() * 0.002 + 0.0005,
      t: Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach((s) => {
        s.t += s.speed;
        const opacity = s.o * (0.4 + 0.6 * Math.sin(s.t));
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });
      blooms.forEach((s) => {
        s.t += s.speed;
        const opacity = s.o * (0.4 + 0.6 * Math.sin(s.t));
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,200,255,${opacity * 0.12})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Calculator logic
  const getSelectedPackageData = () => {
    return packages.find((p) => p.name === selectedPackage) || packages[0];
  };

  const currentPackage = getSelectedPackageData();
  const returnRate = currentPackage.returnRate;
  const returnAmount = (investmentAmount * returnRate) / 100;
  const totalPayout = investmentAmount + returnAmount;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === "") {
      setInvestmentAmount(0);
      setCustomAmount("");
      return;
    }
    const numValue = parseInt(value);
    // Clamp to min/max
    const clampedValue = Math.min(
      Math.max(numValue, currentPackage.minAmount),
      currentPackage.maxAmount,
    );
    setInvestmentAmount(clampedValue);
    setCustomAmount(clampedValue.toLocaleString());
  };

  const handlePackageSelect = (pkgName) => {
    setSelectedPackage(pkgName);
    const pkg = packages.find((p) => p.name === pkgName);
    // Adjust amount if outside new package limits
    if (pkg) {
      let newAmount = investmentAmount;
      if (investmentAmount < pkg.minAmount) {
        newAmount = pkg.minAmount;
      } else if (investmentAmount > pkg.maxAmount) {
        newAmount = pkg.maxAmount;
      }
      setInvestmentAmount(newAmount);
      setCustomAmount(newAmount.toLocaleString());
    }
  };

  const handleQuickAmount = (amt) => {
    const clampedValue = Math.min(
      Math.max(amt, currentPackage.minAmount),
      currentPackage.maxAmount,
    );
    setInvestmentAmount(clampedValue);
    setCustomAmount(clampedValue.toLocaleString());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("https://apex.com/ref/APEX123456");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper function to handle scroll to section
  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL hash without causing a page jump
      window.history.pushState(null, "", `#${sectionId}`);
    }
  };

  const navLinks = [
    { id: "packages", label: "Packages" },
    { id: "how-it-works", label: "How it works" },
    { id: "features", label: "Features" },
    { id: "testimonials", label: "Testimonials" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        .hero-grid { background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px); background-size: 28px 28px; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 60px -12px rgba(0,0,0,0.12); }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">
                A
              </span>
            </div>
            <span className="font-semibold text-gray-900 text-lg tracking-tight">
              APEX <span className="text-emerald-600 font-normal">Trading</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-sm"
            >
              Get started
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollToSection(l.id)}
                    className="block w-full text-left py-2.5 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                  >
                    {l.label}
                  </button>
                ))}
                <div className="pt-3 space-y-2 border-t border-gray-100 mt-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-2.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Get started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
        {/* Deep space base */}
        <div className="absolute inset-0 bg-[#050818]" />
        {/* Nebula layers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(37,99,235,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 70%, rgba(5,150,105,0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(124,58,237,0.12) 0%, transparent 50%)",
          }}
        />
        {/* Star field */}
        <canvas
          id="starfield"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        {/* Soft vignette at bottom to blend into white sections */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        <style>{`
          #starfield { opacity: 0.9; }
        `}</style>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 px-3.5 py-1.5 rounded-full text-xs font-medium mb-8 border border-white/15 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Trusted by 15,000+ investors across Nigeria
              </div>

              <h1 className="serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
                Grow your wealth
                <br />
                <em className="not-italic text-emerald-400">intelligently.</em>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-md">
                Earn up to{" "}
                <strong className="text-white font-semibold">
                  50% returns
                </strong>{" "}
                in 15 working days. Start with as little as ₦10,000 and withdraw
                on a predictable schedule.
              </p>

              <div className="flex flex-wrap gap-3 mb-14">
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/60"
                >
                  Start investing <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/15 transition backdrop-blur-sm"
                >
                  <Gift className="w-4 h-4 text-emerald-400" /> Get referral
                  link
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Users",
                    value: statsReady ? stats.totalUsers.toLocaleString() : "—",
                  },
                  { label: "Invested", value: statsReady ? "₦1.25B+" : "—" },
                  { label: "Withdrawn", value: statsReady ? "₦875M+" : "—" },
                  {
                    label: "Active now",
                    value: statsReady
                      ? stats.activeInvestments.toLocaleString()
                      : "—",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/8 backdrop-blur-sm rounded-xl border border-white/10 p-3"
                  >
                    <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                    <p className="text-sm font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — calculator card (FIXED) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div
                className="absolute -inset-px rounded-3xl opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.5), rgba(5,150,105,0.3))",
                }}
              />
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/40 p-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                  Investment calculator
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Package</p>
                    <div className="flex gap-2">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.name}
                          onClick={() => handlePackageSelect(pkg.name)}
                          className={`flex-1 text-center py-2 rounded-lg text-sm font-semibold transition-all ${
                            selectedPackage === pkg.name
                              ? pkg.name === "APEX 1"
                                ? "bg-blue-600 text-white"
                                : "bg-emerald-600 text-white"
                              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          {pkg.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Amount (₦)</p>
                    <div className="flex items-center gap-2 border border-white/15 rounded-lg px-3 py-2.5 bg-white/5 focus-within:border-blue-500/50 transition">
                      <span className="text-gray-400 text-sm">₦</span>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleAmountChange}
                        className="w-full text-sm font-semibold text-white outline-none bg-transparent"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {[50000, 100000, 250000, 500000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleQuickAmount(amt)}
                          className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition"
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Min: ₦{currentPackage.minAmount.toLocaleString()} · Max: ₦
                      {currentPackage.maxAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Principal</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(investmentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Return ({returnRate}%)
                    </span>
                    <span className="font-semibold text-blue-400">
                      +{formatCurrency(returnAmount)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-medium">
                      Total payout
                    </span>
                    <span className="font-bold text-emerald-400 text-base">
                      {formatCurrency(totalPayout)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  {currentPackage.payments} · {currentPackage.duration}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section id="packages" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Investment packages
            </p>
            <h2 className="serif text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
              Two plans,
              <br />
              one goal.
            </h2>
            <p className="text-gray-500 text-lg">
              Choose based on your capital and timeline.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  {...fadeUp(i * 0.15)}
                  className={`relative bg-white rounded-2xl overflow-hidden card-hover border ${pkg.highlight ? "border-emerald-200 shadow-lg shadow-emerald-100/40" : "border-gray-200"}`}
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {pkg.badge}
                    </div>
                  )}
                  <div
                    className="p-7 border-b border-gray-100"
                    style={{
                      background: `linear-gradient(135deg, ${pkg.accentLight} 0%, white 100%)`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: pkg.accent }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-5xl font-bold"
                        style={{ color: pkg.accent }}
                      >
                        {pkg.returnRate}%
                      </span>
                      <span className="text-gray-500 text-sm">return</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {pkg.duration} · {pkg.payments}
                    </p>
                  </div>

                  <div className="p-7">
                    <div className="flex justify-between text-sm mb-5 pb-5 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Minimum</p>
                        <p className="font-semibold text-gray-900">
                          ₦{pkg.minAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">Maximum</p>
                        <p className="font-semibold text-gray-900">
                          ₦{pkg.maxAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-7">
                      {pkg.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2.5 text-sm text-gray-600"
                        >
                          <CheckCircle
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: pkg.accent }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigate("/register")}
                      className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: pkg.accent, color: "white" }}
                    >
                      Invest in {pkg.name}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 className="serif text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
              Up and running
              <br />
              in four steps.
            </h2>
            <p className="text-gray-500 text-lg">
              Simple onboarding, no complexity.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  {...fadeUp(i * 0.1)}
                  className="relative"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(100%-16px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-gray-200 to-transparent z-10" />
                  )}
                  <div className="bg-gray-50 rounded-2xl p-6 h-full border border-gray-100 card-hover">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-200">
                        {step.n}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Why us
            </p>
            <h2 className="serif text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
              Built for serious
              <br />
              investors.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp(i * 0.07)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 card-hover"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="serif text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
              Real returns,
              <br />
              real people.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 card-hover flex flex-col"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                  "{t.comment}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: t.bg }}
                  >
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t.location} · {t.date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">{t.investment}</p>
                    <p className="text-sm font-bold text-emerald-600">
                      {t.profit}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="serif text-4xl md:text-5xl text-gray-900 leading-tight">
              Common questions.
            </h2>
          </motion.div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.04)}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="serif text-4xl md:text-6xl text-white leading-tight mb-5">
              Start earning
              <br />
              <em className="not-italic text-emerald-400">today.</em>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of investors already growing their wealth on Apex
              Trading Square.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition shadow-sm"
              >
                Create free account <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-7 py-3.5 border border-gray-700 text-gray-300 text-sm font-semibold rounded-xl hover:border-gray-500 hover:text-white transition"
              >
                Sign in
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="font-semibold text-white">APEX Trading</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Empowering Nigerians to achieve financial freedom through
                structured investments.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Platform",
                links: navLinks.map((l) => ({
                  label: l.label,
                  to: `#${l.id}`,
                })),
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy policy", to: "/privacy" },
                  { label: "Terms of service", to: "/terms" },
                  { label: "Help center", to: "/faq" },
                  { label: "Contact", to: "/contact" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to.startsWith("#") ? (
                        <button
                          onClick={() => scrollToSection(l.to.replace("#", ""))}
                          className="text-sm text-gray-500 hover:text-white transition"
                        >
                          {l.label}
                        </button>
                      ) : (
                        <Link
                          to={l.to}
                          className="text-sm text-gray-500 hover:text-white transition"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Contact
              </p>
              <ul className="space-y-3">
                {[
                  { Icon: Phone, text: "+234 800 000 0000" },
                  { Icon: Mail, text: "support@apextrading.com" },
                  { Icon: MapPin, text: "Lagos, Nigeria" },
                ].map(({ Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-gray-500"
                  >
                    <Icon size={14} className="flex-shrink-0 text-gray-600" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Apex Trading Square. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── REFERRAL MODAL ── */}
      <AnimatePresence>
        {showReferralModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Your referral link
                </h3>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Share this link and earn 5% when your friends invest.
              </p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
                <code className="flex-1 text-xs text-blue-600 truncate font-mono">
                  https://apex.com/ref/APEX123456
                </code>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-lg transition"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-emerald-600 mb-3">
                  Copied to clipboard!
                </p>
              )}
              <p className="text-xs text-gray-400 mb-5">
                You need an account to earn referral bonuses.
              </p>
              <button
                onClick={() => {
                  setShowReferralModal(false);
                  navigate("/register");
                }}
                className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                Create account to earn
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;