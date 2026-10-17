"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import PackageManager from "./PackageManager";
import DepartureManager from "./DepartureManager";
import FlightManager from "./FlightManager";
import HotelManager from "./HotelManager";
import GalleryManager from "./GalleryManager";
import CountryManager from "./CountryManager";
import CrmManager from "./CrmManager";
import StaffManager from "./StaffManager";
import AdminLoginForm from "./AdminLoginForm";
import {
  Package,
  RefreshCw,
  Lock,
  LogOut,
  KeyRound,
  AlertCircle,
  CalendarDays,
  Plane,
  Building2,
  Camera,
  Globe2,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  ArrowLeft,
  Key,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_CONFIGS, UserRole, AdminTab } from "@/lib/auth";

export interface CurrentAdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badge: string;
  allowedTabs: AdminTab[];
  crmServiceFilter?: string;
}

interface TwoFactorPendingState {
  tempToken: string;
  email: string;
  name: string;
  hintCode?: string;
}

const DEPARTMENT_PRESETS = [
  {
    role: "MASTER_ADMIN" as UserRole,
    name: "Master Administrator",
    badge: "Master Admin (2FA)",
    desc: "Full management & 2FA protected",
    email: "admin@skywalkholidays.com",
    pass: "admin123",
  },
  {
    role: "TOURS_ADMIN" as UserRole,
    name: "Tours Desk Officer",
    badge: "Tours Desk",
    desc: "Packages, destinations & tour leads",
    email: "tours@skywalkholidays.com",
    pass: "tours123",
  },
  {
    role: "FLIGHTS_ADMIN" as UserRole,
    name: "Ticketing Desk Officer",
    badge: "Ticketing Desk",
    desc: "Flight deals & ticketing inquiries",
    email: "flights@skywalkholidays.com",
    pass: "flights123",
  },
  {
    role: "HOTELS_ADMIN" as UserRole,
    name: "Hotels Operations Desk",
    badge: "Hotels Desk",
    desc: "Hotel listings & reservation leads",
    email: "hotels@skywalkholidays.com",
    pass: "hotels123",
  },
  {
    role: "VISA_ADMIN" as UserRole,
    name: "Visa Specialist",
    badge: "Visa Desk",
    desc: "Visa applications & filing reviews",
    email: "visa@skywalkholidays.com",
    pass: "visa123",
  },
  {
    role: "MEDIA_ADMIN" as UserRole,
    name: "Media & Content Officer",
    badge: "Media Desk",
    desc: "Photo assets & marketing gallery",
    email: "media@skywalkholidays.com",
    pass: "media123",
  },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("skywalk_admin_logged") === "true";
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<CurrentAdminUser | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skywalk_admin_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return null;
  });

  const [loginEmail, setLoginEmail] = useState("admin@skywalkholidays.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // 2FA Flow State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [twoFactorPending, setTwoFactorPending] = useState<TwoFactorPendingState | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [useBackupKey, setUseBackupKey] = useState(false);
  const [resendNotice, setResendNotice] = useState("");

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skywalk_admin_user");
      if (saved) {
        try {
          const u = JSON.parse(saved);
          if (u.allowedTabs && u.allowedTabs.length > 0) {
            return u.allowedTabs[0];
          }
        } catch (e) {}
      }
    }
    return "crm";
  });

  // Verify auth session background verification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/sys-admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const roleKey = (data.user.role || "MASTER_ADMIN") as UserRole;
            const config = ROLE_CONFIGS[roleKey];
            const userWithTabs: CurrentAdminUser = {
              id: data.user.userId || data.user.id || `usr-${roleKey.toLowerCase()}`,
              name: data.user.name || "Administrator",
              email: data.user.email,
              role: roleKey,
              badge: data.user.badge || config?.badge || "Staff Officer",
              allowedTabs: data.user.allowedTabs || config?.allowedTabs || ["crm"],
              crmServiceFilter: data.user.crmServiceFilter || config?.crmServiceFilter,
            };

            if (typeof window !== "undefined") {
              localStorage.setItem("skywalk_admin_logged", "true");
              localStorage.setItem("skywalk_admin_user", JSON.stringify(userWithTabs));
            }
            setCurrentUser(userWithTabs);
            setIsAuthenticated(true);
            return;
          }
        }
      } catch (err) {}

      if (typeof window !== "undefined") {
        const isLogged = localStorage.getItem("skywalk_admin_logged") === "true";
        const savedUser = localStorage.getItem("skywalk_admin_user");
        if (isLogged && savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            setCurrentUser(parsed);
            setIsAuthenticated(true);
            return;
          } catch (e) {}
        }
      }
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  // When currentUser changes or loads, ensure activeTab is among allowedTabs
  useEffect(() => {
    if (currentUser?.allowedTabs && currentUser.allowedTabs.length > 0) {
      if (!currentUser.allowedTabs.includes(activeTab)) {
        setActiveTab(currentUser.allowedTabs[0]);
      }
    }
  }, [currentUser, activeTab]);

  // Initial Email + Password Sign In Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/sys-admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        // Check if 2FA is required (Enforced for Master Admin)
        if (data.requires2FA) {
          setTwoFactorPending({
            tempToken: data.tempToken,
            email: data.email,
            name: data.name,
            hintCode: data.hintCode,
          });
          setTwoFactorCode(data.hintCode || "");
          setIs2FAStep(true);
          setLoginError("");
          setUseBackupKey(false);
          return;
        }

        // Direct login for other departments
        if (data.success && data.user) {
          const roleKey = (data.user.role || "TOURS_ADMIN") as UserRole;
          const config = ROLE_CONFIGS[roleKey];
          const userObj: CurrentAdminUser = {
            id: data.user.id || `usr-${roleKey.toLowerCase()}`,
            name: data.user.name || "Staff Member",
            email: data.user.email,
            role: roleKey,
            badge: data.user.badge || config?.badge || "Staff Officer",
            allowedTabs: data.user.allowedTabs || config?.allowedTabs || ["crm"],
            crmServiceFilter: data.user.crmServiceFilter || config?.crmServiceFilter,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem("skywalk_admin_logged", "true");
            localStorage.setItem("skywalk_admin_user", JSON.stringify(userObj));
          }
          setCurrentUser(userObj);
          setActiveTab(userObj.allowedTabs[0] || "crm");
          setIsAuthenticated(true);
        } else {
          setLoginError(data.error || "Invalid email or password. Please try again.");
        }
      } else {
        setLoginError(data.error || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      setLoginError("Unable to reach the server. Please check your network connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  // 2FA Verification Handler for Master Admin
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setLoginError("Please enter your 6-digit verification code or master backup key.");
      return;
    }
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/sys-admin/auth/2fa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempToken: twoFactorPending?.tempToken,
          code: twoFactorCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const roleKey = (data.user.role || "MASTER_ADMIN") as UserRole;
        const config = ROLE_CONFIGS[roleKey];
        const userObj: CurrentAdminUser = {
          id: data.user.id || `usr-${roleKey.toLowerCase()}`,
          name: data.user.name || "Administrator",
          email: data.user.email,
          role: roleKey,
          badge: data.user.badge || config?.badge || "Master Admin",
          allowedTabs: data.user.allowedTabs || config?.allowedTabs || ["crm"],
          crmServiceFilter: data.user.crmServiceFilter || config?.crmServiceFilter,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("skywalk_admin_logged", "true");
          localStorage.setItem("skywalk_admin_user", JSON.stringify(userObj));
        }
        setCurrentUser(userObj);
        setActiveTab(userObj.allowedTabs[0] || "crm");
        setIsAuthenticated(true);
        setIs2FAStep(false);
        setTwoFactorPending(null);
      } else {
        setLoginError(data.error || "Invalid verification code. Please check and try again.");
      }
    } catch (error) {
      setLoginError("Server communication error. Please check your connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Resend 2FA Code
  const handleResend2FA = async () => {
    if (!twoFactorPending?.tempToken) return;
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/sys-admin/auth/2fa-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken: twoFactorPending.tempToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTwoFactorPending((prev) =>
          prev
            ? {
                ...prev,
                tempToken: data.tempToken,
                hintCode: data.hintCode,
              }
            : null
        );
        setTwoFactorCode(data.hintCode || "");
        setResendNotice("A fresh 6-digit code has been generated.");
        setTimeout(() => setResendNotice(""), 4500);
      } else {
        setLoginError(data.error || "Unable to resend code. Please sign in again.");
      }
    } catch (e) {
      setLoginError("Failed to resend code.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skywalk_admin_logged");
      localStorage.removeItem("skywalk_admin_user");
    }
    document.cookie = "skywalk_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIs2FAStep(false);
    setTwoFactorPending(null);
    window.location.href = "/login";
  };

  const allowedTabs = currentUser?.allowedTabs || [
    "crm",
    "packages",
    "countries",
    "departures",
    "flights",
    "hotels",
    "gallery",
    "staff",
  ];

  // User initials for clean avatar
  const getUserInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Dedicated Login Portal View when not signed in
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  // 3. Standard Enterprise Dashboard Navigation & Shell
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-16">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-200/90 bg-white shrink-0 p-0.5">
              <Image
                src="/images/logo.png"
                alt="Skywalk Holidays Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Skywalk Holidays
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-medium text-slate-500">
                  Management Portal
                </span>
              </div>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            {/* Quick Department Switcher */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Desk:</span>
              <select
                value={currentUser?.role || "MASTER_ADMIN"}
                onChange={(e) => {
                  const targetRole = e.target.value as UserRole;
                  const targetPreset = DEPARTMENT_PRESETS.find((p) => p.role === targetRole);
                  if (targetPreset) {
                    if (targetRole === "MASTER_ADMIN" && currentUser?.role !== "MASTER_ADMIN") {
                      handleLogout();
                      return;
                    }
                    const roleConfig = ROLE_CONFIGS[targetRole];
                    const updatedUser: CurrentAdminUser = {
                      id: `usr-${targetRole.toLowerCase()}`,
                      name: targetPreset.name,
                      email: targetPreset.email,
                      role: targetRole,
                      badge: roleConfig.badge,
                      allowedTabs: roleConfig.allowedTabs,
                      crmServiceFilter: roleConfig.crmServiceFilter,
                    };
                    setCurrentUser(updatedUser);
                    localStorage.setItem("skywalk_admin_user", JSON.stringify(updatedUser));
                    setActiveTab(roleConfig.allowedTabs[0]);
                  }
                }}
                className="text-xs font-medium px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none"
                title="Switch active department desk"
              >
                <option value="MASTER_ADMIN">👑 Master Admin (All Tabs)</option>
                <option value="TOURS_ADMIN">🎒 Tours &amp; Packages Desk</option>
                <option value="FLIGHTS_ADMIN">✈️ Ticketing &amp; Flights Desk</option>
                <option value="HOTELS_ADMIN">🏨 Hotels &amp; Stays Desk</option>
                <option value="VISA_ADMIN">🛂 Visa Specialist Desk</option>
                <option value="MEDIA_ADMIN">📷 Media &amp; Gallery Desk</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
                {getUserInitials(currentUser?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800 leading-none">
                    {currentUser?.name || "Administrator"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {currentUser?.badge || "Staff"}
                  </span>
                  {currentUser?.role === "MASTER_ADMIN" && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                      <ShieldCheck size={10} />
                      2FA Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {currentUser?.email}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 rounded-lg border-slate-200"
            >
              <LogOut size={13} className="mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Tabs Bar */}
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {allowedTabs.includes("crm") && (
              <button
                type="button"
                onClick={() => setActiveTab("crm")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "crm"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Users size={14} className={activeTab === "crm" ? "text-white" : "text-slate-400"} />
                <span>
                  {currentUser?.crmServiceFilter
                    ? `${currentUser.crmServiceFilter} CRM`
                    : "CRM & Inquiries"}
                </span>
              </button>
            )}

            {allowedTabs.includes("packages") && (
              <button
                type="button"
                onClick={() => setActiveTab("packages")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "packages"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Package size={14} className={activeTab === "packages" ? "text-white" : "text-slate-400"} />
                <span>Holiday Packages</span>
              </button>
            )}

            {allowedTabs.includes("countries") && (
              <button
                type="button"
                onClick={() => setActiveTab("countries")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "countries"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Globe2 size={14} className={activeTab === "countries" ? "text-white" : "text-slate-400"} />
                <span>Destinations</span>
              </button>
            )}

            {allowedTabs.includes("departures") && (
              <button
                type="button"
                onClick={() => setActiveTab("departures")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "departures"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <CalendarDays size={14} className={activeTab === "departures" ? "text-white" : "text-slate-400"} />
                <span>Fixed Departures</span>
              </button>
            )}

            {allowedTabs.includes("flights") && (
              <button
                type="button"
                onClick={() => setActiveTab("flights")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "flights"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Plane size={14} className={activeTab === "flights" ? "text-white" : "text-slate-400"} />
                <span>Flight Deals</span>
              </button>
            )}

            {allowedTabs.includes("hotels") && (
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "hotels"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Building2 size={14} className={activeTab === "hotels" ? "text-white" : "text-slate-400"} />
                <span>Hotels &amp; Stays</span>
              </button>
            )}

            {allowedTabs.includes("gallery") && (
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === "gallery"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Camera size={14} className={activeTab === "gallery" ? "text-white" : "text-slate-400"} />
                <span>Photo Gallery</span>
              </button>
            )}

            {allowedTabs.includes("staff") && (
              <button
                type="button"
                onClick={() => setActiveTab("staff")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ml-auto ${
                  activeTab === "staff"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck size={14} className={activeTab === "staff" ? "text-white" : "text-slate-400"} />
                <span>Staff &amp; Access</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "crm" && (
          <CrmManager
            crmServiceFilter={currentUser?.crmServiceFilter}
            userRole={currentUser?.role}
          />
        )}
        {activeTab === "packages" && <PackageManager />}
        {activeTab === "countries" && <CountryManager />}
        {activeTab === "departures" && <DepartureManager />}
        {activeTab === "flights" && <FlightManager />}
        {activeTab === "hotels" && <HotelManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "staff" && <StaffManager />}
      </main>
    </div>
  );
}
