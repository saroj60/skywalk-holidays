import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export interface StoredInquiry {
  id: string;
  table: "flight" | "hotel" | "package" | "visa" | "bus" | "contact";
  serviceType: string;
  customerName: string;
  whatsappNumber: string;
  destination?: string | null;
  travelDate?: string | null;
  status: "NEW" | "CONTACTED" | "QUOTATION_SENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  assignedStaff?: string;
  notes?: string;
  createdDate: string;
  createdAt: string;
  rawPayload?: Record<string, any>;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries-backup.json");

function ensureFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to ensure inquiries file:", err);
  }
}

export function getLocalInquiries(): StoredInquiry[] {
  try {
    ensureFile();
    if (fs.existsSync(INQUIRIES_FILE)) {
      const content = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read inquiries file:", err);
  }
  return [];
}

export function saveLocalInquiry(
  item: Omit<StoredInquiry, "id" | "createdAt" | "createdDate" | "status"> & {
    id?: string;
    status?: StoredInquiry["status"];
    createdAt?: string;
    createdDate?: string;
  }
): StoredInquiry {
  try {
    ensureFile();
    const existing = getLocalInquiries();
    const now = new Date();
    const newInquiry: StoredInquiry = {
      id: item.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      table: item.table,
      serviceType: item.serviceType,
      customerName: item.customerName,
      whatsappNumber: item.whatsappNumber,
      destination: item.destination || null,
      travelDate: item.travelDate || null,
      status: item.status || "NEW",
      assignedStaff: item.assignedStaff || "Unassigned",
      notes: item.notes || "",
      createdDate: item.createdDate || now.toISOString().split("T")[0],
      createdAt: item.createdAt || now.toISOString(),
      rawPayload: item.rawPayload || {},
    };

    existing.unshift(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return newInquiry;
  } catch (err) {
    console.error("Failed to save local inquiry backup:", err);
    return {
      id: `lead-${Date.now()}`,
      table: item.table,
      serviceType: item.serviceType,
      customerName: item.customerName,
      whatsappNumber: item.whatsappNumber,
      destination: item.destination || null,
      travelDate: item.travelDate || null,
      status: "NEW",
      assignedStaff: "Unassigned",
      notes: item.notes || "",
      createdDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
  }
}

export function updateLocalInquiry(id: string, updates: Partial<StoredInquiry>): StoredInquiry | null {
  try {
    ensureFile();
    const list = getLocalInquiries();
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
      return list[idx];
    }
  } catch (err) {
    console.error("Failed to update local inquiry:", err);
  }
  return null;
}

export function deleteLocalInquiry(id: string): boolean {
  try {
    ensureFile();
    const list = getLocalInquiries();
    const filtered = list.filter((x) => x.id !== id);
    if (filtered.length !== list.length) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
      return true;
    }
  } catch (err) {
    console.error("Failed to delete local inquiry:", err);
  }
  return false;
}
