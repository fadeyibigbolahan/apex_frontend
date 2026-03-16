import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Home,
  Shield,
  ChevronRight,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: location.pathname === "/admin/users",
    },
    {
      name: "Investments",
      href: "/admin/investments",
      icon: TrendingUp,
      current: location.pathname === "/admin/investments",
    },
    {
      name: "Withdrawals",
      href: "/admin/withdrawals",
      icon: TrendingUp,
      current: location.pathname === "/admin/withdrawals",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname === "/admin/settings",
    },
  ];

  const currentPage = navigation.find((n) => n.current)?.name || "Admin";

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-60 bg-[#0b0f1a] flex flex-col z-30 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* top accent — red tint for admin */}
        <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-orange-400 to-transparent" />

        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold tracking-tight text-base">
              APEX<span className="text-red-400 font-light"> Admin</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="mx-3 mb-4 rounded-xl bg-white/5 border border-white/8 px-3 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-semibold text-sm shadow-md shrink-0">
            {user?.firstName?.[0] || user?.email?.[0] || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate leading-tight">
              {user?.firstName || "Admin"}
            </p>
            <p className="text-white/40 text-xs truncate leading-tight mt-0.5">
              Administrator
            </p>
          </div>
        </div>

        {/* Section label */}
        <p className="px-5 text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-1.5">
          Management
        </p>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    item.current
                      ? "bg-gradient-to-r from-red-600/80 to-orange-500/80 text-white shadow-sm shadow-red-900/40"
                      : "text-white/50 hover:text-white hover:bg-white/6"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${item.current ? "text-white" : "text-white/40 group-hover:text-white/80"}`}
                />
                <span className="truncate">{item.name}</span>
                {item.current && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-white/8 pt-3 space-y-0.5">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/6 transition-all"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Back to Site</span>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* ── TOPBAR ── */}
        <header className="fixed top-0 right-0 left-0 lg:left-60 h-14 bg-white/90 backdrop-blur-md border-b border-gray-200/70 z-10 flex items-center px-4 lg:px-6 gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-400 text-xs hidden sm:inline">
              APEX Admin
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:inline" />
            <span className="text-gray-800 text-sm font-semibold truncate">
              {currentPage}
            </span>
          </div>

          {/* Admin badge pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full">
            <Shield className="w-3 h-3 text-red-500" />
            <span className="text-[11px] font-semibold text-red-600">
              Admin Panel
            </span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-44">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search…"
              className="bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden md:block" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                {user?.firstName?.[0] || user?.email?.[0] || "A"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-700 leading-tight">
                  {user?.firstName || "Admin"}
                </p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-xs font-semibold text-gray-800">
                      {user?.firstName || "Admin"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Shield className="w-3.5 h-3.5 text-gray-400" /> Your
                    Profile
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 pt-14">
          <div className="px-4 lg:px-8 py-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
