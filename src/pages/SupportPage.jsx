import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Gift,
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Send,
  X,
  ChevronDown,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Headphones,
  Zap,
  Award,
  Calendar,
  Lock,
} from "lucide-react";

/* ── animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Contact form submitted:", contactForm);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const faqs = [
    {
      question: "How do working days work?",
      answer:
        "We count only weekdays (Monday-Friday). Weekends are excluded from the investment duration. For example, if you invest on Friday, Day 1 starts on Monday. Your withdrawal schedule is based on these working days, not calendar days.",
      category: "general",
    },
    {
      question: "When can I withdraw my money?",
      answer:
        "Withdrawals are available every 5 working days according to your package. For Apex1, you get 2 payments (every 5 working days). For Apex2, you get 3 equal payments (every 5 working days). You'll see a withdrawal button on your dashboard when funds are available.",
      category: "withdrawals",
    },
    {
      question: "How do I earn the retrading bonus?",
      answer:
        "You earn a 3% retrading bonus when you reinvest before fully withdrawing your previous investment. For example, if you have an active investment and you make a new one, you automatically get 3% on the new investment amount.",
      category: "bonuses",
    },
    {
      question: "How does the referral bonus work?",
      answer:
        "Share your unique referral link with friends. When they register using your link and make their first investment (confirmed by admin), you earn a one-time 5% bonus on their investment amount. This bonus becomes available for withdrawal once their payment is confirmed.",
      category: "bonuses",
    },
    {
      question: "What's the minimum for bonus withdrawal?",
      answer:
        "You need a minimum of ₦10,000 in combined referral and retrading bonuses to request a withdrawal. The withdrawal button will only appear once you reach this threshold.",
      category: "withdrawals",
    },
    {
      question: "Can I change my bank details?",
      answer:
        "Bank details are locked after first save for security reasons. If you need to change them, please contact admin through this support page or email support@apextrading.com.",
      category: "account",
    },
    {
      question: "How long does payment confirmation take?",
      answer:
        "Admin reviews all payment proofs within 24 hours. Once confirmed, your investment starts counting working days immediately. You'll receive a notification when your payment is confirmed.",
      category: "investments",
    },
    {
      question: "What happens if my payment is declined?",
      answer:
        "If your payment proof is unclear or incorrect, admin will decline it with a reason. You can upload a new payment proof from your investment details page.",
      category: "investments",
    },
    {
      question: "Can I invest in multiple plans at once?",
      answer:
        "Yes! You can have multiple active investments in both Apex1 and Apex2 plans simultaneously. Each investment runs independently with its own withdrawal schedule.",
      category: "investments",
    },
    {
      question: "Is there a limit to how many times I can reinvest?",
      answer:
        "No, you can reinvest as many times as you want. Each reinvestment qualifies for the 3% retrading bonus as long as you have an active investment running.",
      category: "investments",
    },
    {
      question: "How do I track my referrals?",
      answer:
        "Visit the Referrals page from your dashboard. You'll see your referral link, total referrals, active investors, and bonus earnings. Each referral's status is displayed.",
      category: "referrals",
    },
    {
      question: "What if I forget my password?",
      answer:
        "Click the 'Forgot Password' link on the login page. Enter your email address and we'll send you instructions to reset your password.",
      category: "account",
    },
  ];

  const categories = [
    { id: "all", label: "All Questions", count: faqs.length },
    {
      id: "general",
      label: "General",
      count: faqs.filter((f) => f.category === "general").length,
    },
    {
      id: "investments",
      label: "Investments",
      count: faqs.filter((f) => f.category === "investments").length,
    },
    {
      id: "withdrawals",
      label: "Withdrawals",
      count: faqs.filter((f) => f.category === "withdrawals").length,
    },
    {
      id: "bonuses",
      label: "Bonuses",
      count: faqs.filter((f) => f.category === "bonuses").length,
    },
    {
      id: "account",
      label: "Account",
      count: faqs.filter((f) => f.category === "account").length,
    },
    {
      id: "referrals",
      label: "Referrals",
      count: faqs.filter((f) => f.category === "referrals").length,
    },
  ];

  const filteredFaqs =
    activeTab === "all" ? faqs : faqs.filter((f) => f.category === activeTab);

  const quickLinks = [
    {
      title: "Investment Guide",
      description: "Learn how to start investing",
      icon: TrendingUp,
      link: "/investments/create",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Referral Program",
      description: "Earn 5% on friend's investments",
      icon: Users,
      link: "/referrals",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Bonus System",
      description: "How to earn retrading bonuses",
      icon: Gift,
      link: "/bonuses",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Withdrawal Process",
      description: "How and when to withdraw",
      icon: Wallet,
      link: "/withdrawals",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get a response within 24 hours",
      action: "support@apextrading.com",
      link: "mailto:support@apextrading.com",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      link: "#",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Mon-Fri, 9am-6pm",
      action: "+234 800 000 0000",
      link: "tel:+2348000000000",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Headphones,
      title: "Help Center",
      description: "Browse documentation",
      action: "Visit Help Center",
      link: "#",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── HEADER ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={fadeUp} className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            How can we help you?
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team
          </p>
        </motion.div>
      </motion.div>

      {/* ── QUICK LINKS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {quickLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} variants={fadeUp} custom={i}>
              <Link
                to={item.link}
                className="group block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all hover:border-blue-100"
              >
                <div
                  className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400">{item.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: FAQ Section */}
        <div className="lg:col-span-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {filteredFaqs.length} articles
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex overflow-x-auto pb-2 mb-6 gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === cat.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </motion.div>
              ))}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No questions in this category
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-6 text-white"
          >
            <h3 className="text-lg font-bold mb-4">Still need help?</h3>
            <p className="text-sm text-white/80 mb-6">
              Our support team is ready to assist you with any questions or
              issues you may have.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  (window.location.href = "mailto:support@apextrading.com")
                }
                className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Email Support
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-all"
              >
                Contact Form
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Contact & Support Info */}
        <div className="space-y-6">
          {/* Contact Methods */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="space-y-4">
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <a
                    key={i}
                    href={method.link}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition group"
                  >
                    <div
                      className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {method.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                      <p className="text-xs font-semibold text-blue-600 mt-1">
                        {method.action}{" "}
                        <ExternalLink className="w-3 h-3 inline ml-0.5" />
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white"
          >
            <h3 className="text-sm font-bold mb-4">Support Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-emerald-400">&lt; 24h</p>
                <p className="text-xs text-gray-400">Avg. response time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">98%</p>
                <p className="text-xs text-gray-400">Satisfaction rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">24/7</p>
                <p className="text-xs text-gray-400">Support available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">15min</p>
                <p className="text-xs text-gray-400">Live chat wait</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          {/* <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Send a Message
            </h2>
            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Message Sent!
                </p>
                <p className="text-xs text-gray-400">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div> */}

          {/* Live Chat Widget (Placeholder) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-100 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Live Chat</p>
                <p className="text-xs text-emerald-600">
                  Typically replies in 5min
                </p>
              </div>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      {/* ── INFO BANNER ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">
                Need Immediate Assistance?
              </h3>
              <p className="text-sm text-white/80">
                Our support team is available 24/7 to help you with any urgent
                issues.
              </p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "tel:+2348000000000")}
            className="shrink-0 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Call Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;
