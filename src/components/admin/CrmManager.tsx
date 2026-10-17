"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  RefreshCw,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Download,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  ChevronRight,
  UserCheck,
  Send,
  AlertCircle,
  Check,
  X,
  Plane,
  Hotel,
  Package,
  FileCheck,
  Bus,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CrmStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTATION_SENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface CrmLead {
  id: string;
  rawId: string;
  table: "package" | "flight" | "hotel" | "visa" | "bus" | "contact" | string;
  customerName: string;
  serviceType: string;
  destination: string;
  travelDate: string;
  whatsappNumber: string;
  email?: string;
  travelers?: string;
  budget?: string;
  status: CrmStatus;
  createdDate: string;
  assignedStaff: string;
  notes: string;
}

const CRM_STORAGE_KEY = "skywalk_admin_crm_leads_v2";

export const STAFF_MEMBERS = [
  "Unassigned",
  "Saroj",
  "Aayush",
  "Tour Desk",
  "Ticketing Desk",
  "Visa Specialist",
];

export const PIPELINE_STAGES: {
  key: CrmStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderCol: string;
  dotColor: string;
}[] = [
  {
    key: "NEW",
    label: "New Leads",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    borderCol: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  {
    key: "CONTACTED",
    label: "Contacted",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    borderCol: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  {
    key: "QUOTATION_SENT",
    label: "Quotation Sent",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    borderCol: "border-purple-200",
    dotColor: "bg-purple-500",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    borderCol: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    borderCol: "border-slate-200",
    dotColor: "bg-slate-500",
  },
  {
    key: "CANCELLED",
    label: "Lost / Closed",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    borderCol: "border-rose-200",
    dotColor: "bg-rose-500",
  },
];

interface CrmManagerProps {
  crmServiceFilter?: string;
  userRole?: string;
}

export default function CrmManager({ crmServiceFilter, userRole }: CrmManagerProps = {}) {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(crmServiceFilter || "All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<CrmStatus | null>(null);

  useEffect(() => {
    if (crmServiceFilter && userRole !== "MASTER_ADMIN") {
      setSelectedService(crmServiceFilter);
    }
  }, [crmServiceFilter, userRole]);

  // Modals state
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Status-based WhatsApp states
  const [whatsAppModalLead, setWhatsAppModalLead] = useState<CrmLead | null>(null);
  const [whatsAppSelectedStatus, setWhatsAppSelectedStatus] = useState<CrmStatus>("NEW");
  const [whatsAppMessageText, setWhatsAppMessageText] = useState<string>("");
  const [whatsAppSyncStatus, setWhatsAppSyncStatus] = useState<boolean>(true);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Status update notification toast state
  const [statusUpdateToast, setStatusUpdateToast] = useState<{
    lead: CrmLead;
    newStatus: CrmStatus;
  } | null>(null);

  useEffect(() => {
    if (statusUpdateToast) {
      const timer = setTimeout(() => {
        setStatusUpdateToast(null);
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [statusUpdateToast]);

  // New lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: "",
    whatsappNumber: "",
    email: "",
    serviceType: "Holiday Package",
    destination: "",
    travelDate: "",
    travelers: "2 Travelers",
    budget: "",
    assignedStaff: "Saroj",
    notes: "",
    status: "NEW" as CrmStatus,
  });

  // Load CRM leads from backend API or local storage
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sys-admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        if (data.leads && Array.isArray(data.leads)) {
          // Check local storage for overrides/newly added local leads
          const savedLocal = localStorage.getItem(CRM_STORAGE_KEY);
          if (savedLocal) {
            try {
              const parsedLocal = JSON.parse(savedLocal);
              if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
                // Merge by ID
                const leadMap = new Map<string, CrmLead>();
                data.leads.forEach((l: CrmLead) => leadMap.set(l.id, l));
                parsedLocal.forEach((l: CrmLead) => leadMap.set(l.id, l));
                const merged = Array.from(leadMap.values());
                setLeads(merged);
                localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(merged));
                setLoading(false);
                return;
              }
            } catch (e) {}
          }
          setLeads(data.leads);
          localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(data.leads));
          setLoading(false);
          return;
        }
      }
    } catch (err) {}

    // Fallback to local storage
    const stored = localStorage.getItem(CRM_STORAGE_KEY);
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {}
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Save changes to localStorage and send update to API
  const updateLeadStatus = async (
    leadId: string,
    newStatus: CrmStatus,
    table?: string,
    rawId?: string
  ) => {
    const prevLead = leads.find((l) => l.id === leadId);
    const updated = leads.map((lead) =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    setLeads(updated);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }

    if (prevLead && prevLead.status !== newStatus) {
      setStatusUpdateToast({
        lead: { ...prevLead, status: newStatus },
        newStatus,
      });
    }

    try {
      const targetId = rawId || leadId;
      await fetch(`/api/sys-admin/inquiries/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, status: newStatus }),
      });
    } catch (e) {}
  };

  const updateLeadStaff = async (
    leadId: string,
    staffName: string,
    table?: string,
    rawId?: string
  ) => {
    const updated = leads.map((lead) =>
      lead.id === leadId ? { ...lead, assignedStaff: staffName } : lead
    );
    setLeads(updated);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, assignedStaff: staffName });
    }

    try {
      const targetId = rawId || leadId;
      await fetch(`/api/sys-admin/inquiries/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, assignedStaff: staffName }),
      });
    } catch (e) {}
  };

  const updateLeadNotes = async (
    leadId: string,
    newNotes: string,
    table?: string,
    rawId?: string
  ) => {
    const updated = leads.map((lead) =>
      lead.id === leadId ? { ...lead, notes: newNotes } : lead
    );
    setLeads(updated);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, notes: newNotes });
    }

    try {
      const targetId = rawId || leadId;
      await fetch(`/api/sys-admin/inquiries/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, notes: newNotes }),
      });
    } catch (e) {}
  };

  const handleDeleteLead = async (leadId: string, table?: string, rawId?: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const filtered = leads.filter((l) => l.id !== leadId);
    setLeads(filtered);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(filtered));
    if (selectedLead?.id === leadId) {
      setIsDetailModalOpen(false);
    }

    try {
      const targetId = rawId || leadId;
      await fetch(`/api/sys-admin/inquiries/${targetId}?table=${table}`, {
        method: "DELETE",
      });
    } catch (e) {}
  };

  // Create new manual lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: CrmLead = {
      id: `LEAD-${Date.now().toString().slice(-6)}`,
      rawId: `lead-${Date.now()}`,
      table: "contact",
      customerName: newLeadForm.customerName.trim(),
      whatsappNumber: newLeadForm.whatsappNumber.trim(),
      email: newLeadForm.email.trim() || undefined,
      serviceType: newLeadForm.serviceType,
      destination: newLeadForm.destination.trim() || "Unspecified",
      travelDate: newLeadForm.travelDate.trim() || "Flexible",
      travelers: newLeadForm.travelers.trim() || "1 Traveler",
      budget: newLeadForm.budget.trim() || undefined,
      assignedStaff: newLeadForm.assignedStaff,
      notes: newLeadForm.notes.trim() || "Manual lead entry from admin CRM.",
      status: newLeadForm.status,
      createdDate: new Date().toISOString().split("T")[0],
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
    setIsNewLeadModalOpen(false);

    // Reset form
    setNewLeadForm({
      customerName: "",
      whatsappNumber: "",
      email: "",
      serviceType: "Holiday Package",
      destination: "",
      travelDate: "",
      travelers: "2 Travelers",
      budget: "",
      assignedStaff: "Saroj",
      notes: "",
      status: "NEW",
    });

    try {
      await fetch("/api/sys-admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
    } catch (e) {}
  };

  // Status-tailored WhatsApp messages generator
  const getStatusWhatsAppMessage = (lead: CrmLead, status: CrmStatus): string => {
    const name = lead.customerName || "Valued Traveler";
    const service = lead.serviceType || "Holiday Package";
    const destination = lead.destination || "your destination";
    const travelDate = lead.travelDate || "flexible dates";
    const travelers = lead.travelers || "traveler(s)";
    const refId = lead.id;

    switch (status) {
      case "NEW":
        return `Namaste ${name}! 🙏\nGreetings from SkyWalk Holidays Kathmandu.\n\nWe have received your travel inquiry:\n🏷️ Service: ${service}\n📍 Destination: ${destination}\n📅 Travel Date: ${travelDate}\n👥 Travelers: ${travelers}\n\nOur travel consultant is reviewing your requirements and will share the best options with you shortly. If you have any urgent questions, feel free to reply directly here!\n\nWarm regards,\nSkyWalk Holidays Team ✈️`;

      case "CONTACTED":
        return `Namaste ${name}! 🙏\nGreetings from SkyWalk Holidays.\n\nThank you for discussing your upcoming trip to ${destination} (${travelers}, Travel Date: ${travelDate}). Our team is currently designing a customized travel itinerary tailored to your preferences.\n\nPlease let us know if you have specific airline, hotel, or sightseeing preferences so we can finalize the best proposal for you!\n\nWarm regards,\nSkyWalk Holidays Team 🌍`;

      case "QUOTATION_SENT":
        return `Namaste ${name}! ✈️\nGreetings from SkyWalk Holidays.\n\nWe have prepared the quotation and detailed itinerary for your ${destination} trip (${service})!\n👥 Travelers: ${travelers}\n📅 Travel Date: ${travelDate}\n📋 Reference: ${refId}\n\nPlease review the details at your convenience. We can easily customize hotel choices, dates, or inclusions to suit your budget. Let us know your thoughts!\n\nWarm regards,\nSkyWalk Holidays Team`;

      case "CONFIRMED":
        return `Namaste ${name}! 🎉✈️\nCongratulations! Your booking for ${destination} (${service}) with SkyWalk Holidays is officially CONFIRMED!\n\n📋 Booking Reference: ${refId}\n📅 Travel Date: ${travelDate}\n👥 Travelers: ${travelers}\n\nOur operations team is finalizing your travel vouchers, hotel confirmations, and flight tickets. We will share the complete travel document kit with you shortly.\n\nThank you for choosing SkyWalk Holidays!\nWarm regards,\nSkyWalk Holidays Team 🌟`;

      case "COMPLETED":
        return `Namaste ${name}! 🌸\nWelcome back! We hope you had a fantastic and unforgettable journey to ${destination} with SkyWalk Holidays.\n\nOur team would love to hear your feedback on the hotels, transport, and overall experience. Your review helps us continuously improve!\n\nWe look forward to serving you again on your next holiday! 🌍\nWarm regards,\nSkyWalk Holidays Team`;

      case "CANCELLED":
        return `Namaste ${name}.\nGreetings from SkyWalk Holidays.\n\nAs discussed, we have updated your inquiry for ${destination} (${refId}) as closed/on hold. Whenever you are ready to plan your travels in the future, our doors are always open for you!\n\nWishing you all the best.\nWarm regards,\nSkyWalk Holidays Team`;

      default:
        return `Namaste ${name}! Greetings from SkyWalk Holidays Kathmandu. Regarding your inquiry for ${service} (${destination}): our team is ready to assist you. May we share the itinerary and best quotation?`;
    }
  };

  // Open Status-Based WhatsApp composer
  const handleOpenWhatsAppModal = (lead: CrmLead, targetStatus?: CrmStatus) => {
    const status = targetStatus || lead.status;
    setWhatsAppModalLead(lead);
    setWhatsAppSelectedStatus(status);
    setWhatsAppMessageText(getStatusWhatsAppMessage(lead, status));
    setWhatsAppSyncStatus(lead.status !== status);
    setCopiedFeedback(false);
  };

  // Switch template in composer modal
  const handleSelectModalStatus = (status: CrmStatus) => {
    if (!whatsAppModalLead) return;
    setWhatsAppSelectedStatus(status);
    setWhatsAppMessageText(getStatusWhatsAppMessage(whatsAppModalLead, status));
    setWhatsAppSyncStatus(whatsAppModalLead.status !== status);
  };

  // Send WhatsApp message directly
  const handleSendWhatsApp = (
    lead: CrmLead,
    message: string,
    syncStatus?: boolean,
    newStatus?: CrmStatus
  ) => {
    if (syncStatus && newStatus && lead.status !== newStatus) {
      updateLeadStatus(lead.id, newStatus, lead.table, lead.rawId);
    }

    let cleanPhone = lead.whatsappNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone.startsWith("977") && cleanPhone.length === 10) {
      cleanPhone = `977${cleanPhone}`;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setWhatsAppModalLead(null);
  };

  // Copy message text to clipboard
  const handleCopyWhatsAppMessage = () => {
    if (!whatsAppMessageText) return;
    navigator.clipboard.writeText(whatsAppMessageText);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  // Backwards compatibility alias
  const handleLaunchWhatsApp = (lead: CrmLead) => {
    handleOpenWhatsAppModal(lead);
  };

  // Export current filtered leads to CSV
  const handleExportCsv = () => {
    if (filteredLeads.length === 0) return;
    const headers = [
      "Lead ID",
      "Customer Name",
      "Phone / WhatsApp",
      "Email",
      "Service Type",
      "Destination",
      "Travel Date",
      "Travelers",
      "Budget",
      "Status",
      "Assigned Staff",
      "Created Date",
      "Notes",
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.customerName.replace(/"/g, '""')}"`,
      `"${l.whatsappNumber}"`,
      `"${l.email || ""}"`,
      `"${l.serviceType}"`,
      `"${l.destination.replace(/"/g, '""')}"`,
      `"${l.travelDate}"`,
      `"${l.travelers || ""}"`,
      `"${l.budget || ""}"`,
      `"${l.status}"`,
      `"${l.assignedStaff}"`,
      `"${l.createdDate}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SkyWalk_CRM_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = lead.customerName.toLowerCase().includes(query);
        const matchesPhone = lead.whatsappNumber.toLowerCase().includes(query);
        const matchesDest = lead.destination.toLowerCase().includes(query);
        const matchesId = lead.id.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesDest && !matchesId) return false;
      }
      // Service
      if (selectedService !== "All" && lead.serviceType !== selectedService) {
        return false;
      }
      // Status
      if (selectedStatus !== "All" && lead.status !== selectedStatus) {
        return false;
      }
      // Staff
      if (selectedStaff !== "All" && lead.assignedStaff !== selectedStaff) {
        return false;
      }
      return true;
    });
  }, [leads, searchQuery, selectedService, selectedStatus, selectedStaff]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "NEW").length;
    const inProgress = leads.filter((l) => l.status === "CONTACTED" || l.status === "QUOTATION_SENT").length;
    const confirmed = leads.filter((l) => l.status === "CONFIRMED" || l.status === "COMPLETED").length;
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    return { total, newCount, inProgress, confirmed, conversionRate };
  }, [leads]);

  // Helper for Service Icon
  const getServiceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("flight")) return <Plane size={14} className="text-blue-500" />;
    if (t.includes("hotel")) return <Hotel size={14} className="text-amber-500" />;
    if (t.includes("visa")) return <FileCheck size={14} className="text-violet-500" />;
    if (t.includes("bus")) return <Bus size={14} className="text-emerald-500" />;
    return <Package size={14} className="text-sky-500" />;
  };

  return (
    <div className="py-2 text-left">
      {/* 1. Header & Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            CRM &amp; Inquiries Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer inquiries, leads status, follow-ups, and sales tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLeads}
            disabled={loading}
            className="text-xs font-medium gap-1.5 rounded-lg border-slate-200 h-9 px-3"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredLeads.length === 0}
            className="text-xs font-medium gap-1.5 rounded-lg border-slate-200 h-9 px-3"
          >
            <Download size={13} />
            Export CSV ({filteredLeads.length})
          </Button>

          <Button
            size="sm"
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium gap-1.5 rounded-lg h-9 px-3 shadow-xs"
          >
            <Plus size={14} />
            Add Manual Lead
          </Button>
        </div>
      </div>

      {/* 2. Top Analytics Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Inquiries</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.total}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Users size={17} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              New Leads
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-0.5">{metrics.newCount}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles size={17} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-700 font-medium">In Follow-Up</div>
            <div className="text-2xl font-bold text-blue-600 mt-0.5">{metrics.inProgress}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Send size={17} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-700 font-medium">Confirmed Trips</div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{metrics.confirmed}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={17} />
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Conversion Rate</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.conversionRate}%</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <DollarSign size={17} />
          </div>
        </div>
      </div>

      {/* 3. Filters & View Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, phone, destination, or ID..."
              className="pl-9 bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end lg:self-auto shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-[#0a1628] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List size={14} />
              Table View
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-[#0a1628] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid size={14} />
              Pipeline Kanban
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>

          {/* Service Dropdown */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            disabled={Boolean(crmServiceFilter && userRole !== "MASTER_ADMIN")}
            className={`text-xs font-semibold px-2.5 py-1.5 border rounded-lg text-[#0a1628] focus:outline-none ${
              crmServiceFilter && userRole !== "MASTER_ADMIN"
                ? "bg-sky-50 border-sky-300 text-[#0ea5e9] cursor-not-allowed"
                : "bg-slate-50 border-slate-200 focus:border-[#0ea5e9]"
            }`}
          >
            {(!crmServiceFilter || userRole === "MASTER_ADMIN") && (
              <option value="All">All Services</option>
            )}
            <option value="Holiday Package">Holiday Packages</option>
            <option value="Flight Ticket">Flight Tickets</option>
            <option value="Hotel Booking">Hotel Bookings</option>
            <option value="Visa Assistance">Visa Assistance</option>
            <option value="Bus Booking">Bus Bookings</option>
            <option value="Contact Inquiry">Contact Inquiries</option>
          </select>
          {crmServiceFilter && userRole !== "MASTER_ADMIN" && (
            <span className="text-[10px] bg-sky-100 text-[#0ea5e9] px-2 py-0.5 rounded-full font-bold">
              Desk Locked
            </span>
          )}

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="All">All Statuses</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Staff Dropdown */}
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="All">All Staff Agents</option>
            {STAFF_MEMBERS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {(selectedService !== "All" ||
            selectedStatus !== "All" ||
            selectedStaff !== "All" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedService("All");
                setSelectedStatus("All");
                setSelectedStaff("All");
                setSearchQuery("");
              }}
              className="text-xs text-[#0ea5e9] hover:underline font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Body: Table View or Kanban View */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Lead ID / Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service &amp; Destination</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4 text-center">Quick WhatsApp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Search size={20} />
                      </div>
                      <p className="font-semibold text-sm text-[#0a1628]">No leads matching criteria</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const stage = PIPELINE_STAGES.find((s) => s.key === lead.status) || PIPELINE_STAGES[0];
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        {/* ID & Date */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-[#0a1628] block">{lead.id}</span>
                          <span className="text-[10px] text-slate-400">{lead.createdDate}</span>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0a1628]">{lead.customerName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                            <Phone size={10} className="text-slate-400" />
                            {lead.whatsappNumber}
                          </div>
                          {lead.email && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {lead.email}
                            </div>
                          )}
                        </td>

                        {/* Service & Destination */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-semibold text-[#0a1628]">
                            {getServiceIcon(lead.serviceType)}
                            <span>{lead.serviceType}</span>
                          </div>
                          <div className="text-[11px] text-[#64748b] flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-sky-500 shrink-0" />
                            <span className="truncate max-w-[170px]">{lead.destination}</span>
                          </div>
                        </td>

                        {/* Travel Date */}
                        <td className="py-3.5 px-4 text-[#64748b]">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Calendar size={11} className="text-slate-400" />
                            <span>{lead.travelDate}</span>
                          </div>
                          {lead.travelers && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{lead.travelers}</div>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td
                          className="py-3.5 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateLeadStatus(
                                lead.id,
                                e.target.value as CrmStatus,
                                lead.table,
                                lead.rawId
                              )
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer focus:outline-none ${stage.badgeBg} ${stage.badgeText} ${stage.borderCol}`}
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.key} value={s.key} className="bg-white text-[#0a1628]">
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Assigned Staff Dropdown */}
                        <td
                          className="py-3.5 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={lead.assignedStaff}
                            onChange={(e) =>
                              updateLeadStaff(
                                lead.id,
                                e.target.value,
                                lead.table,
                                lead.rawId
                              )
                            }
                            className="text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[#0a1628] font-medium cursor-pointer focus:outline-none focus:border-[#0ea5e9]"
                          >
                            {STAFF_MEMBERS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Quick WhatsApp Action */}
                        <td
                          className="py-3.5 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleLaunchWhatsApp(lead)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 text-[11px] font-medium transition-colors cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={12} className="text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:${lead.whatsappNumber}`}
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Call Customer"
                            >
                              <Phone size={14} />
                            </a>
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-[#0ea5e9] hover:bg-slate-100 rounded-lg transition-colors"
                              title="View & Edit Notes"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteLead(lead.id, lead.table, lead.rawId)
                              }
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline Board View */
        <div className="flex gap-4 items-start overflow-x-auto pb-6 pt-1 scrollbar-thin">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
            const isDragOver = dragOverStage === stage.key;

            return (
              <div
                key={stage.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage.key);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverStage(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
                  if (leadId) {
                    const targetLead = leads.find((l) => l.id === leadId);
                    if (targetLead && targetLead.status !== stage.key) {
                      updateLeadStatus(leadId, stage.key, targetLead.table, targetLead.rawId);
                    }
                  }
                  setDraggedLeadId(null);
                  setDragOverStage(null);
                }}
                className={`rounded-2xl p-3 border flex flex-col min-h-[540px] transition-all w-[290px] shrink-0 ${
                  isDragOver
                    ? "bg-sky-50/90 border-sky-400 ring-2 ring-sky-400/40 shadow-md"
                    : "bg-slate-100/80 border-slate-200"
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                    <span className="text-xs font-bold text-slate-900">{stage.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-xs border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[680px] pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl my-2">
                      Drop leads here
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const isBeingDragged = draggedLeadId === lead.id;

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", lead.id);
                            e.dataTransfer.effectAllowed = "move";
                            setDraggedLeadId(lead.id);
                          }}
                          onDragEnd={() => {
                            setDraggedLeadId(null);
                            setDragOverStage(null);
                          }}
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsDetailModalOpen(true);
                          }}
                          className={`bg-white p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing text-left ${
                            isBeingDragged
                              ? "opacity-40 border-sky-400 shadow-md scale-95"
                              : "border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
                          }`}
                        >
                          {/* Top Tag Row */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="font-mono text-[10px] text-slate-400 font-semibold">
                              {lead.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                              {lead.assignedStaff}
                            </span>
                          </div>

                          {/* Customer Name */}
                          <div className="font-bold text-xs text-slate-900 leading-tight mb-1">
                            {lead.customerName}
                          </div>

                          {/* Service & Destination */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1.5 truncate">
                            {getServiceIcon(lead.serviceType)}
                            <span className="truncate">{lead.destination}</span>
                          </div>

                          {/* Travel Date & Budget */}
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2.5">
                            <Calendar size={11} className="text-slate-400 shrink-0" />
                            <span>{lead.travelDate}</span>
                            {lead.budget && (
                              <span className="ml-auto font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                {lead.budget}
                              </span>
                            )}
                          </div>

                          {/* Actions Row */}
                          <div
                            className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleLaunchWhatsApp(lead)}
                              className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shrink-0"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare size={12} className="text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>

                            <select
                              value={lead.status}
                              onChange={(e) =>
                                updateLeadStatus(
                                  lead.id,
                                  e.target.value as CrmStatus,
                                  lead.table,
                                  lead.rawId
                                )
                              }
                              className="text-[10px] font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 cursor-pointer focus:outline-none focus:border-slate-400 max-w-[130px] truncate"
                              title="Move pipeline stage"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  Move: {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Lead Details & Follow-up Notes Modal */}
      {isDetailModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-left">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-5 pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-[#0ea5e9]">
                  {selectedLead.id}
                </span>
                <h3 className="text-xl font-extrabold text-[#0a1628] leading-tight mt-0.5">
                  {selectedLead.customerName}
                </h3>
                <p className="text-xs text-slate-500">
                  Inquired on {selectedLead.createdDate} via {selectedLead.serviceType}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLaunchWhatsApp(selectedLead)}
                  className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                >
                  <MessageSquare size={13} className="fill-white" />
                  Chat on WhatsApp
                </button>
                <a
                  href={`tel:${selectedLead.whatsappNumber}`}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0a1628]"
                  title="Call Customer"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Phone / WhatsApp
                </span>
                <span className="font-mono font-bold text-[#0a1628]">
                  {selectedLead.whatsappNumber}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Email Address
                </span>
                <span className="text-[#0a1628] truncate block">
                  {selectedLead.email || "Not provided"}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Destination / Route
                </span>
                <span className="font-semibold text-[#0a1628]">
                  {selectedLead.destination}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Travel Date / Duration
                </span>
                <span className="font-semibold text-[#0a1628]">
                  {selectedLead.travelDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Travelers / Guests
                </span>
                <span className="font-semibold text-[#0a1628]">
                  {selectedLead.travelers || "2 Travelers"}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Estimated Budget
                </span>
                <span className="font-mono font-bold text-emerald-600">
                  {selectedLead.budget || "Flexible"}
                </span>
              </div>
            </div>

            {/* Pipeline Status & Staff Assignment */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                  Pipeline Stage
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    updateLeadStatus(
                      selectedLead.id,
                      e.target.value as CrmStatus,
                      selectedLead.table,
                      selectedLead.rawId
                    )
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                  Assigned Staff Agent
                </label>
                <select
                  value={selectedLead.assignedStaff}
                  onChange={(e) =>
                    updateLeadStaff(
                      selectedLead.id,
                      e.target.value,
                      selectedLead.table,
                      selectedLead.rawId
                    )
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                >
                  {STAFF_MEMBERS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Internal Staff Notes & History */}
            <div className="mb-6">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block flex items-center justify-between">
                <span>Internal Staff Follow-Up Notes</span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">
                  auto-saved
                </span>
              </label>
              <textarea
                rows={4}
                value={selectedLead.notes}
                onChange={(e) =>
                  updateLeadNotes(
                    selectedLead.id,
                    e.target.value,
                    selectedLead.table,
                    selectedLead.rawId
                  )
                }
                placeholder="Add conversation summary, customer budget, hotel preferences, or callback time..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() =>
                  handleDeleteLead(
                    selectedLead.id,
                    selectedLead.table,
                    selectedLead.rawId
                  )
                }
                className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1"
              >
                <Trash2 size={13} />
                Delete Lead
              </button>

              <Button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-[#0a1628] hover:bg-[#0ea5e9] text-white text-xs font-bold rounded-xl px-5"
              >
                Close &amp; Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add Manual Lead Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-left">
            <button
              onClick={() => setIsNewLeadModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-extrabold text-[#0a1628] mb-1">
              Record New Customer Inquiry
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Manually add a phone walk-in, social media inquiry, or direct lead to your pipeline.
            </p>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Customer Name *
                  </label>
                  <Input
                    required
                    value={newLeadForm.customerName}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, customerName: e.target.value })
                    }
                    placeholder="e.g. Ramesh Adhikari"
                    className="h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    WhatsApp / Phone *
                  </label>
                  <Input
                    required
                    value={newLeadForm.whatsappNumber}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, whatsappNumber: e.target.value })
                    }
                    placeholder="e.g. 9779841234567"
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Service Interested
                  </label>
                  <select
                    value={newLeadForm.serviceType}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, serviceType: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                  >
                    <option value="Holiday Package">Holiday Package</option>
                    <option value="Flight Ticket">Flight Ticket</option>
                    <option value="Hotel Booking">Hotel Booking</option>
                    <option value="Visa Assistance">Visa Assistance</option>
                    <option value="Custom Tour">Custom Tour</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Destination Region
                  </label>
                  <Input
                    value={newLeadForm.destination}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, destination: e.target.value })
                    }
                    placeholder="e.g. Thailand, Bali, Japan"
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Travel Date
                  </label>
                  <Input
                    value={newLeadForm.travelDate}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, travelDate: e.target.value })
                    }
                    placeholder="e.g. Nov 2026"
                    className="h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Travelers
                  </label>
                  <Input
                    value={newLeadForm.travelers}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, travelers: e.target.value })
                    }
                    placeholder="e.g. 2 Adults"
                    className="h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Budget
                  </label>
                  <Input
                    value={newLeadForm.budget}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, budget: e.target.value })
                    }
                    placeholder="e.g. NPR 120,000"
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Assign Agent
                  </label>
                  <select
                    value={newLeadForm.assignedStaff}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, assignedStaff: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                  >
                    {STAFF_MEMBERS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                    Initial Status
                  </label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) =>
                      setNewLeadForm({
                        ...newLeadForm,
                        status: e.target.value as CrmStatus,
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0a1628] uppercase text-[10px] tracking-wider mb-1 block">
                  Customer Requirements &amp; Notes
                </label>
                <textarea
                  rows={3}
                  value={newLeadForm.notes}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, notes: e.target.value })
                  }
                  placeholder="Preferences, special requests, accommodation type..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Lead to CRM
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Status-Tailored WhatsApp Composer Modal */}
      {whatsAppModalLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-left">
            <button
              onClick={() => setWhatsAppModalLead(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-slate-200">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare size={22} />
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    WhatsApp Status Message
                  </h3>
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {whatsAppModalLead.whatsappNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  Client: <strong className="text-slate-800">{whatsAppModalLead.customerName}</strong> • {whatsAppModalLead.serviceType} ({whatsAppModalLead.destination})
                </p>
              </div>
            </div>

            {/* Status Template Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Select Status Template:
                </label>
                <span className="text-[11px] text-slate-500">
                  Current Status: <strong className="text-slate-800 font-semibold">{whatsAppModalLead.status.replace("_", " ")}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {PIPELINE_STAGES.map((stage) => {
                  const isSelected = whatsAppSelectedStatus === stage.key;
                  return (
                    <button
                      key={stage.key}
                      type="button"
                      onClick={() => handleSelectModalStatus(stage.key)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : stage.dotColor}`} />
                      <span className="truncate">{stage.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Message Preview (Editable):
                </label>
                <button
                  type="button"
                  onClick={handleCopyWhatsAppMessage}
                  className="text-xs font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedFeedback ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={7}
                value={whatsAppMessageText}
                onChange={(e) => setWhatsAppMessageText(e.target.value)}
                placeholder="Type your WhatsApp message..."
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/60 resize-none font-normal"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: You can customize or add custom prices, flight timings, or hotel details before sending.
              </p>
            </div>

            {/* Optional: Sync lead status */}
            {whatsAppModalLead.status !== whatsAppSelectedStatus && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <AlertCircle size={15} className="shrink-0 text-amber-600" />
                  <span>
                    Also update lead status to <strong className="font-bold">{whatsAppSelectedStatus.replace("_", " ")}</strong>?
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsAppSyncStatus}
                  onChange={(e) => setWhatsAppSyncStatus(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWhatsAppModalLead(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={() =>
                  handleSendWhatsApp(
                    whatsAppModalLead,
                    whatsAppMessageText,
                    whatsAppSyncStatus,
                    whatsAppSelectedStatus
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send size={13} />
                <span>Open in WhatsApp</span>
                <ExternalLink size={12} className="opacity-75" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Status Updated Notification Toast */}
      {statusUpdateToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                  Status Changed
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {statusUpdateToast.newStatus.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                Send status update via WhatsApp to <strong className="text-white">{statusUpdateToast.lead.customerName}</strong>?
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenWhatsAppModal(statusUpdateToast.lead, statusUpdateToast.newStatus);
                    setStatusUpdateToast(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Send size={11} />
                  <span>Send WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusUpdateToast(null)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatusUpdateToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
