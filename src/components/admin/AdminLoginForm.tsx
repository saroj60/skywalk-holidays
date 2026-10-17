"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_CONFIGS, UserRole } from "@/lib/auth";

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
    desc: "Packages, destinations & departures",
    email: "tours@skywalkholidays.com",
    pass: "tours123",
  },
  {
    role: "FLIGHTS_ADMIN" as UserRole,
    name: "Ticketing Desk Officer",
    badge: "Ticketing Desk",
    desc: "Flight deals & ticketing leads",
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

export default function AdminLoginForm() {
  const router = useRouter();
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

  // Check if already authenticated, redirect to /admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLogged = localStorage.getItem("skywalk_admin_logged") === "true";
      if (isLogged) {
        router.push("/admin");
      }
    }
  }, [router]);

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

        if (data.success && data.user) {
          const roleKey = (data.user.role || "TOURS_ADMIN") as UserRole;
          const config = ROLE_CONFIGS[roleKey];
          const userObj = {
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

          window.location.href = "/admin";
          return;
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
        const userObj = {
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

        window.location.href = "/admin";
      } else {
        setLoginError(data.error || "Invalid verification code. Please check and try again.");
      }
    } catch (error) {
      setLoginError("Server communication error. Please check your connection.");
    } finally {
      setLoginLoading(false);
    }
  };

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

  // 1. Two-Factor Authentication (2FA) Gate Screen
  if (is2FAStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-[#0a1628] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white p-1">
                <Image
                  src="/images/logo.png"
                  alt="Skywalk Holidays Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-emerald-400 shadow-xs">
                <ShieldCheck size={14} />
              </div>
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white">
            Two-Factor Authentication (2FA)
          </h2>
          <p className="mt-1 text-center text-xs text-sky-200/70">
            High-privilege security verification for Master Administrator
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl border border-slate-200 rounded-3xl text-slate-900 text-left">
            {loginError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            {resendNotice && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span className="font-medium">{resendNotice}</span>
              </div>
            )}

            <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-slate-600 font-medium">
                Admin Account: <strong className="text-slate-900">{twoFactorPending?.email}</strong>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Enter the 6-digit one-time passcode to confirm your identity.
              </p>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {useBackupKey ? "Master Backup Recovery Key" : "6-Digit Security Passcode"}
                </label>
                <Input
                  type="text"
                  required
                  autoFocus
                  maxLength={useBackupKey ? 40 : 6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder={useBackupKey ? "SKYWALK-MASTER-SECURE-2026" : "123456"}
                  className={`bg-white border-slate-300 text-base font-mono tracking-widest text-center h-11 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 rounded-xl ${
                    useBackupKey ? "text-xs tracking-wider" : "text-lg font-bold"
                  }`}
                />
              </div>

              {twoFactorPending?.hintCode && !useBackupKey && (
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-emerald-800 font-medium">
                    Test 2FA OTP: <strong className="font-mono text-xs">{twoFactorPending.hintCode}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorCode(twoFactorPending.hintCode || "")}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[#0a1628] hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md h-11 mt-1"
              >
                {loginLoading ? (
                  <RefreshCw size={16} className="animate-spin mr-2" />
                ) : (
                  <ShieldCheck size={16} className="mr-2 text-emerald-400" />
                )}
                <span>Verify &amp; Enter Master Control</span>
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setUseBackupKey(!useBackupKey);
                  setTwoFactorCode(useBackupKey ? twoFactorPending?.hintCode || "" : "SKYWALK-MASTER-SECURE-2026");
                }}
                className="text-slate-600 hover:text-slate-900 font-semibold hover:underline"
              >
                {useBackupKey ? "Use 6-Digit OTP" : "Use Backup Key"}
              </button>

              <button
                type="button"
                onClick={handleResend2FA}
                disabled={loginLoading}
                className="text-slate-600 hover:text-slate-900 font-semibold hover:underline"
              >
                Resend Code
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIs2FAStep(false);
                  setLoginError("");
                }}
                className="text-xs text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 font-semibold"
              >
                <ArrowLeft size={12} />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Standard Enterprise Login Portal
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f213a] to-[#0a1628] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-white relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white p-1">
            <Image
              src="/images/logo.png"
              alt="Skywalk Holidays Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white">
          Skywalks Admin &amp; Staff Login
        </h1>
        <p className="mt-1 text-center text-xs text-sky-200/70">
          Secure Department Operations &amp; Content Management Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl border border-slate-100 rounded-3xl text-slate-900 text-left">
          {loginError && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span className="font-semibold">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Email Address
              </label>
              <Input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@skywalkholidays.com"
                className="bg-white border-slate-300 text-sm h-11 focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <Input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white border-slate-300 text-sm h-11 focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/25 h-11 mt-2"
            >
              {loginLoading ? (
                <RefreshCw size={16} className="animate-spin mr-2" />
              ) : (
                <KeyRound size={16} className="mr-2" />
              )}
              <span>Sign In to Dashboard</span>
            </Button>
          </form>

          {/* Department Quick Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Quick Select Department Account
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENT_PRESETS.map((p) => {
                const isActive = loginEmail.toLowerCase() === p.email.toLowerCase();
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => {
                      setLoginEmail(p.email);
                      setLoginPassword(p.pass);
                      setLoginError("");
                      setIs2FAStep(false);
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0a1628] text-white border-[#0a1628] shadow-xs"
                        : "bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <div className="font-bold truncate">{p.name}</div>
                    <div className={`text-[10px] truncate ${isActive ? "text-sky-300" : "text-slate-500"}`}>
                      {p.email}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Return to website */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#0ea5e9] font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={13} />
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
