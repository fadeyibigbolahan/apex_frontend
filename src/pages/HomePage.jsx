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
import apex from "../assets/apex.jpeg";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n) => {
  return new Intl.NumberFormat("en-NG").format(n);
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── data ────────────────────────────────────────────────────────────────────
const packages = [
  {
    id: "apex1",
    name: "APEX 1",
    accent: "#9333EA",
    accentLight: "#F3E8FF",
    accentMid: "#D8B4FE",
    icon: Zap,
    returnRate: 30,
    duration: "10 working days",
    payments: "2 payments · 50% each",
    minAmount: 10000,
    maxAmount: 500000,
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
    accent: "#A855F7",
    accentLight: "#FAF5FF",
    accentMid: "#E9D5FF",
    icon: TrendingUp,
    returnRate: 50,
    duration: "15 working days",
    payments: "3 equal payments",
    minAmount: 20000,
    maxAmount: 1000000,
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
    color: "#9333EA",
    bg: "rgba(147, 51, 234, 0.15)",
  },
  {
    icon: Zap,
    title: "Fast withdrawals",
    desc: "Automated payouts every 5 working days, no waiting, no friction.",
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.15)",
  },
  {
    icon: Gift,
    title: "Referral bonuses",
    desc: "Earn 5% one-time bonus every time a friend you refer invests.",
    color: "#C084FC",
    bg: "rgba(192, 132, 252, 0.15)",
  },
  {
    icon: TrendingUp,
    title: "Retrading bonus",
    desc: "Reinvest before full payout and receive an extra 3% on your new amount.",
    color: "#D8B4FE",
    bg: "rgba(216, 180, 254, 0.15)",
  },
  {
    icon: Users,
    title: "Growing community",
    desc: "Over 15,000 active investors building wealth on the platform.",
    color: "#9333EA",
    bg: "rgba(147, 51, 234, 0.15)",
  },
  {
    icon: Clock,
    title: "24/7 support",
    desc: "Our team is available around the clock to assist with any questions.",
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.15)",
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
    bg: "linear-gradient(135deg, #9333EA, #A855F7)",
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
    bg: "linear-gradient(135deg, #A855F7, #C084FC)",
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
    bg: "linear-gradient(135deg, #7E22CE, #9333EA)",
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
  const [inputValue, setInputValue] = useState("100000");
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    activeInvestments: 0,
  });
  const [statsReady, setStatsReady] = useState(false);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Optimized stars effect for mobile
  useEffect(() => {
    const container = document.getElementById("stars-container");
    if (!container) return;

    container.innerHTML = "";

    if (isMobile) {
      for (let i = 0; i < 20; i++) {
        const star = document.createElement("div");
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 1.5 + 0.5;

        star.style.cssText = `
          position: absolute;
          left: ${left}%;
          top: ${top}%;
          width: ${size}px;
          height: ${size}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
        `;

        container.appendChild(star);
      }
    } else {
      // Desktop stars (keep your existing code)
      for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        star.className = "star";

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 2.5 + 0.5;
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.7 + 0.3;

        star.style.cssText = `
          position: absolute;
          left: ${left}%;
          top: ${top}%;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          opacity: ${opacity};
          box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
          animation: twinkle ${duration}s ease-in-out infinite;
          animation-delay: ${delay}s;
          pointer-events: none;
        `;

        container.appendChild(star);
      }

      for (let i = 0; i < 20; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 150 + 50;
        const duration = Math.random() * 20 + 20;
        const delay = Math.random() * 10;

        const colors = ["#481B73", "#5A2A71", "#723A69", "#8A4A61"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        orb.style.cssText = `
          position: absolute;
          left: ${left}%;
          top: ${top}%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle at 30% 30%, ${color}80, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          animation: float ${duration}s ease-in-out infinite;
          animation-delay: ${delay}s;
          pointer-events: none;
        `;

        container.appendChild(orb);
      }

      for (let i = 0; i < 10; i++) {
        const shootingStar = document.createElement("div");
        shootingStar.className = "shooting-star";

        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 3 + 2;

        shootingStar.style.cssText = `
          position: absolute;
          left: ${startX}%;
          top: ${startY}%;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent);
          transform: rotate(-45deg);
          filter: blur(1px);
          animation: shoot ${duration}s linear infinite;
          animation-delay: ${delay}s;
          opacity: 0;
          pointer-events: none;
        `;

        container.appendChild(shootingStar);
      }
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [isMobile]);

  // Calculator logic
  const getSelectedPackageData = () => {
    return packages.find((p) => p.name === selectedPackage) || packages[0];
  };

  const currentPackage = getSelectedPackageData();
  const returnRate = currentPackage.returnRate;
  const returnAmount = (investmentAmount * returnRate) / 100;
  const totalPayout = investmentAmount + returnAmount;

  // FIXED: Improved input handling
  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    
    // Allow empty input
    if (rawValue === "") {
      setInputValue("");
      setInvestmentAmount(0);
      return;
    }

    // Remove any non-digit characters
    const numericValue = rawValue.replace(/[^0-9]/g, "");
    
    if (numericValue === "") {
      setInputValue("");
      setInvestmentAmount(0);
      return;
    }

    const numValue = parseInt(numericValue, 10);
    
    // Update input with raw number (no formatting while typing)
    setInputValue(numericValue);
    setInvestmentAmount(numValue);
  };

  // Handle blur to format the number
  const handleAmountBlur = () => {
    if (investmentAmount === 0) {
      setInputValue("");
      return;
    }

    // Clamp the value between min and max
    const clampedValue = Math.min(
      Math.max(investmentAmount, currentPackage.minAmount),
      currentPackage.maxAmount,
    );

    setInvestmentAmount(clampedValue);
    setInputValue(clampedValue.toString());
  };

  const handlePackageSelect = (pkgName) => {
    setSelectedPackage(pkgName);
    const pkg = packages.find((p) => p.name === pkgName);
    if (pkg) {
      let newAmount = investmentAmount;
      if (investmentAmount < pkg.minAmount) {
        newAmount = pkg.minAmount;
      } else if (investmentAmount > pkg.maxAmount) {
        newAmount = pkg.maxAmount;
      }
      setInvestmentAmount(newAmount);
      setInputValue(newAmount.toString());
    }
  };

  const handleQuickAmount = (amt) => {
    const clampedValue = Math.min(
      Math.max(amt, currentPackage.minAmount),
      currentPackage.maxAmount,
    );
    setInvestmentAmount(clampedValue);
    setInputValue(clampedValue.toString());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("https://apex.com/ref/APEX123456");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      className="min-h-screen relative"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        
        .card-hover { 
          transition: transform 0.25s ease, box-shadow 0.25s ease; 
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
          will-change: transform;
          transform: translateZ(0);
        }
        
        .card-hover:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 20px 60px -12px rgba(147, 51, 234, 0.3);
          border-color: rgba(147, 51, 234, 0.4);
        }
        
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        
        input[type=number] { -moz-appearance: textfield; }
        
        /* Glass morphism effects */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 51, 234, 0.2);
          will-change: transform;
          transform: translateZ(0);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(147, 51, 234, 0.4);
        }
        
        /* Text contrast improvements */
        .text-on-dark {
          color: rgba(255, 255, 255, 0.95);
        }
        .text-on-dark-secondary {
          color: rgba(255, 255, 255, 0.7);
        }
        .text-on-dark-muted {
          color: rgba(255, 255, 255, 0.5);
        }
        
        /* Star animations - only on desktop */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(2%, 2%) scale(1.05); }
          50% { transform: translate(-1%, 3%) scale(0.95); }
          75% { transform: translate(-2%, -1%) scale(1.02); }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }

        #stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        /* Optimize scrolling */
        .min-h-screen {
          -webkit-overflow-scrolling: touch;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .glass-card {
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }
          
          .card-hover:hover {
            transform: none;
            box-shadow: none;
          }
          
          .glass-card:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(147, 51, 234, 0.2);
          }
          
          .star, .orb, .shooting-star {
            animation: none !important;
          }
          
          @media (prefers-reduced-motion: reduce) {
            *, ::before, ::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        }

        #root {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          height: 100vh;
        }
      `}</style>

      {/* Gradient Background */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #2d1b3a 40%, #3d2a3a 70%, #4d353a 100%)",
          zIndex: 0,
          willChange: "transform",
        }}
      />

      {/* Stars Container */}
      <div id="stars-container" />

      {/* Subtle radial gradient overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(114, 58, 105, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(72, 27, 115, 0.1) 0%, transparent 60%)",
          zIndex: 2,
          willChange: "transform",
        }}
      />

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-purple-500/20"
        style={{ zIndex: 50 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-[50px] h-[50px] rounded-lg flex items-center justify-center">
              <img src={apex} alt="apex logo" loading="lazy" />
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              APEX <span className="text-purple-300 font-normal">Trading</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                className="text-base text-gray-300 hover:text-white transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-base text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-base font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-4 py-2 rounded-lg transition shadow-lg shadow-purple-600/30"
            >
              Get started
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition text-white"
            aria-label="Toggle menu"
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
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-purple-500/20 bg-black/60 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollToSection(l.id)}
                    className="block w-full text-left py-2.5 px-3 text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                  >
                    {l.label}
                  </button>
                ))}
                <div className="pt-3 space-y-2 border-t border-purple-500/20 mt-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-2.5 text-base border border-purple-500/30 text-white rounded-lg hover:bg-white/10 transition"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-2.5 text-base font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition"
                  >
                    Get started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* ── HERO ── */}
        <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-white/10 text-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-purple-500/30 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  Trusted by 15,000+ investors across Nigeria
                </div>

                <h1 className="serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
                  Grow your wealth
                  <br />
                  <em className="not-italic text-purple-300">intelligently.</em>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-md">
                  Earn up to{" "}
                  <strong className="text-white font-semibold">
                    50% returns
                  </strong>{" "}
                  in 15 working days. Start with as little as ₦10,000 and
                  withdraw on a predictable schedule.
                </p>

                <div className="flex flex-wrap gap-3 mb-14">
                  <button
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-base font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 transition shadow-lg shadow-purple-600/30"
                  >
                    Start investing <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Users",
                      value: statsReady
                        ? stats.totalUsers.toLocaleString()
                        : "—",
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
                    <div key={s.label} className="glass-card rounded-xl p-3">
                      <p className="stat-label text-sm text-gray-400 mb-1">
                        {s.label}
                      </p>
                      <p className="stat-value text-base font-bold text-white">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right — calculator card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
                className="relative"
              >
                <div
                  className="absolute -inset-px rounded-3xl opacity-40"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147,51,234,0.5), rgba(168,85,247,0.3))",
                  }}
                />
                <div className="relative glass-card rounded-3xl p-8">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
                    Investment calculator
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Package</p>
                      <div className="flex gap-2">
                        {packages.map((pkg) => (
                          <button
                            key={pkg.name}
                            onClick={() => handlePackageSelect(pkg.name)}
                            className={`flex-1 text-center py-2 rounded-lg text-base font-semibold transition-all ${
                              selectedPackage === pkg.name
                                ? pkg.name === "APEX 1"
                                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                                  : "bg-gradient-to-r from-purple-500 to-purple-400 text-white"
                                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
                            }`}
                          >
                            {pkg.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Amount (₦)</p>
                      <div className="flex items-center gap-2 border border-purple-500/30 rounded-lg px-3 py-3 bg-white/5 focus-within:border-purple-400 transition">
                        <span className="text-gray-400 text-base">₦</span>
                        <input
                          type="text"
                          value={inputValue}
                          onChange={handleAmountChange}
                          onBlur={handleAmountBlur}
                          className="w-full text-base font-semibold text-white outline-none bg-transparent"
                          placeholder="Enter amount"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {[50000, 100000, 250000, 500000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => handleQuickAmount(amt)}
                            className="text-sm bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition"
                          >
                            ₦{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Min: ₦{currentPackage.minAmount.toLocaleString()} · Max:
                        ₦{currentPackage.maxAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 space-y-2.5">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-400">Principal</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(investmentAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-400">
                        Return ({returnRate}%)
                      </span>
                      <span className="font-semibold text-purple-300">
                        +{formatCurrency(returnAmount)}
                      </span>
                    </div>
                    <div className="h-px bg-purple-500/20" />
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300 font-medium">
                        Total payout
                      </span>
                      <span className="font-bold text-purple-300 text-lg">
                        {formatCurrency(totalPayout)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-center text-gray-500 mt-4">
                    {currentPackage.payments} · {currentPackage.duration}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Rest of your sections remain exactly the same */}
        {/* ── PACKAGES ── */}
        <section id="packages" className="py-24">
          {/* ... keep your existing packages section code ... */}
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-24">
          {/* ... keep your existing how it works section code ... */}
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24">
          {/* ... keep your existing features section code ... */}
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="py-24">
          {/* ... keep your existing testimonials section code ... */}
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24">
          {/* ... keep your existing FAQ section code ... */}
        </section>

        {/* ── CTA ── */}
        <section className="py-24">
          {/* ... keep your existing CTA section code ... */}
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-14 border-t border-purple-500/20">
          {/* ... keep your existing footer code ... */}
        </footer>
      </div>

      {/* ── REFERRAL MODAL ── */}
      <AnimatePresence>
        {showReferralModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl w-full max-w-sm shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-lg">
                  Your referral link
                </h3>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition"
                  aria-label="Close"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <p className="text-base text-gray-400 mb-5">
                Share this link and earn 5% when your friends invest.
              </p>
              <div className="flex items-center gap-2 bg-white/5 border border-purple-500/30 rounded-xl p-3 mb-4">
                <code className="flex-1 text-sm text-purple-300 truncate font-mono">
                  https://apex.com/ref/APEX123456
                </code>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition"
                  aria-label="Copy link"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-purple-400 mb-3">
                  Copied to clipboard!
                </p>
              )}
              <p className="text-sm text-gray-500 mb-5">
                You need an account to earn referral bonuses.
              </p>
              <button
                onClick={() => {
                  setShowReferralModal(false);
                  navigate("/register");
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-base font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 transition"
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