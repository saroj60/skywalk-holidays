"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Lock,
  Mail,
  KeyRound,
  UserCheck,
  UserX,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_CONFIGS, UserRole } from "@/lib/auth";

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  department: string;
  lastLogin: string;
  status: "ACTIVE" | "SUSPENDED";
}

const STAFF_STORAGE_KEY = "skywalk_staff_accounts_v1";

const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: "usr-master",
    name: "Master Administrator",
    email: "admin@skywalkholidays.com",
    role: "MASTER_ADMIN",
    department: "Executive Management",
    lastLogin: "Just now",
    status: "ACTIVE",
  },
  {
    id: "usr-tours",
    name: "Saroj & Tours Desk",
    email: "tours@skywalkholidays.com",
    role: "TOURS_ADMIN",
    department: "Holiday Packages & Outbound Tours",
    lastLogin: "Today, 11:30 AM",
    status: "ACTIVE",
  },
  {
    id: "usr-flights",
    name: "Aayush & Ticketing Desk",
    email: "flights@skywalkholidays.com",
    role: "FLIGHTS_ADMIN",
    department: "Flight Deals & IATA Ticketing",
    lastLogin: "Yesterday",
    status: "ACTIVE",
  },
  {
    id: "usr-hotels",
    name: "Hotels Operations Desk",
    email: "hotels@skywalkholidays.com",
    role: "HOTELS_ADMIN",
    department: "Partner Hotels & Resorts",
    lastLogin: "2 days ago",
    status: "ACTIVE",
  },
  {
    id: "usr-visa",
    name: "Visa Documentation Specialist",
    email: "visa@skywalkholidays.com",
    role: "VISA_ADMIN",
    department: "Visa Documentation & VFS Filing",
    lastLogin: "Today, 09:15 AM",
    status: "ACTIVE",
  },
  {
    id: "usr-media",
    name: "Marketing & Gallery Desk",
    email: "media@skywalkholidays.com",
    role: "MEDIA_ADMIN",
    department: "Photo Gallery & Social Media",
    lastLogin: "3 days ago",
    status: "ACTIVE",
  },
];

export default function StaffManager() {
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("TOURS_ADMIN");
  const [formDepartment, setFormDepartment] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STAFF_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStaffList(parsed);
            return;
          }
        } catch (e) {}
      }
      setStaffList(INITIAL_STAFF_ACCOUNTS);
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF_ACCOUNTS));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  const handleOpenNewModal = () => {
    setEditingStaff(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("TOURS_ADMIN");
    setFormDepartment("Holiday Packages Desk");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffAccount) => {
    setEditingStaff(staff);
    setFormName(staff.name);
    setFormEmail(staff.email);
    setFormPassword("");
    setFormRole(staff.role);
    setFormDepartment(staff.department);
    setIsModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim()) {
      alert("Name and email are required.");
      return;
    }

    if (!editingStaff && !formPassword.trim()) {
      alert("Password is required for new accounts.");
      return;
    }

    if (editingStaff) {
      const updated: StaffAccount[] = staffList.map((s) => {
        if (s.id === editingStaff.id) {
          return {
            ...s,
            name: formName.trim(),
            email: formEmail.trim().toLowerCase(),
            role: formRole,
            department: formDepartment.trim() || "Operations",
            ...(formPassword.trim() ? { password: formPassword.trim() } : {}),
          };
        }
        return s;
      });

      setStaffList(updated);
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
      showToast(`Updated account for ${formName.trim()}`);
    } else {
      const newStaff: StaffAccount = {
        id: `usr-${Date.now().toString(36)}`,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        role: formRole,
        password: formPassword.trim(),
        department: formDepartment.trim() || "Operations",
        lastLogin: "Never",
        status: "ACTIVE",
      };

      const updated = [newStaff, ...staffList];
      setStaffList(updated);
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
      showToast(`Created staff account for ${formName.trim()}`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    const target = staffList.find((s) => s.id === id);
    if (!target) return;

    if (target.role === "MASTER_ADMIN") {
      alert("Master Administrator account cannot be suspended.");
      return;
    }

    const nextStatus: "ACTIVE" | "SUSPENDED" = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const updated: StaffAccount[] = staffList.map((s) =>
      s.id === id ? { ...s, status: nextStatus } : s
    );
    setStaffList(updated);
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
    showToast(`Account status set to ${nextStatus} for ${target.name}`);
  };

  const handleDeleteStaff = (id: string) => {
    const target = staffList.find((s) => s.id === id);
    if (!target) return;
    if (target.role === "MASTER_ADMIN") {
      alert("Master Administrator account cannot be deleted.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete staff account ${target.name}?`)) return;

    const filtered = staffList.filter((s) => s.id !== id);
    setStaffList(filtered);
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(filtered));
    showToast(`Deleted staff account ${target.name}`);
  };

  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-2 text-left">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Staff &amp; Role Permissions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage staff accounts, assign departmental roles, and configure system permissions.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenNewModal}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium gap-1.5 rounded-lg h-9 px-3 shadow-xs"
        >
          <Plus size={14} />
          Add Staff Account
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="pl-8 bg-slate-50 border-slate-200 text-xs rounded-lg h-9"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
          <div>
            Total: <span className="font-semibold text-slate-800">{staffList.length}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div>
            Active:{" "}
            <span className="font-semibold text-emerald-600">
              {staffList.filter((s) => s.status === "ACTIVE").length}
            </span>
          </div>
        </div>
      </div>

      {/* Staff Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Access Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Permitted Modules</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStaff.map((staff) => {
                const config = ROLE_CONFIGS[staff.role] || ROLE_CONFIGS.TOURS_ADMIN;
                const isMaster = staff.role === "MASTER_ADMIN";

                return (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {staff.name}
                        {isMaster && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Super
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {staff.email}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {config.badge}
                        </span>
                        {isMaster && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck size={10} />
                            2FA Enforced
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-600">
                      {staff.department}
                    </td>

                    {/* Permitted Modules */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {config.allowedTabs.map((tab) => (
                          <span
                            key={tab}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {tab}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(staff.id)}
                        disabled={isMaster}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                          staff.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        } ${isMaster ? "cursor-default opacity-80" : "cursor-pointer"}`}
                        title={isMaster ? "Master Admin cannot be suspended" : "Click to toggle"}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            staff.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {staff.status === "ACTIVE" ? "Active" : "Suspended"}
                      </button>
                    </td>

                    {/* Last Login */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {staff.lastLogin}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={14} />
                        </button>
                        {!isMaster && (
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-6 relative text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-0.5">
              {editingStaff ? `Edit Account: ${editingStaff.name}` : "Create Staff Account"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure credentials and assign department desk access.
            </p>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Full Name *
                </label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ramesh Adhikari"
                  className="h-9 text-xs rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Staff Email *
                </label>
                <Input
                  required
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@skywalkholidays.com"
                  className="h-9 text-xs font-mono rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Department Role *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value="TOURS_ADMIN">Tours &amp; Packages Desk</option>
                    <option value="FLIGHTS_ADMIN">Ticketing &amp; Flights Desk</option>
                    <option value="HOTELS_ADMIN">Hotels &amp; Stays Desk</option>
                    <option value="VISA_ADMIN">Visa Documentation Desk</option>
                    <option value="MEDIA_ADMIN">Media &amp; Gallery Desk</option>
                    <option value="MASTER_ADMIN">Master Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Department Title
                  </label>
                  <Input
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="e.g. Outbound Tours"
                    className="h-9 text-xs rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  {editingStaff ? "New Password (optional)" : "Password *"}
                </label>
                <Input
                  type="password"
                  required={!editingStaff}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingStaff ? "Leave blank to keep unchanged" : "••••••••"}
                  className="h-9 text-xs font-mono rounded-lg"
                />
              </div>

              {/* Permitted Modules Preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Permitted Modules:
                </span>
                <div className="flex flex-wrap gap-1">
                  {ROLE_CONFIGS[formRole].allowedTabs.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs rounded-lg h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg h-8 shadow-xs"
                >
                  {editingStaff ? "Save Changes" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
