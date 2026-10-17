import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "skywalk_holidays_super_secret_jwt_key_2026";

export type UserRole =
  | "MASTER_ADMIN"
  | "TOURS_ADMIN"
  | "FLIGHTS_ADMIN"
  | "HOTELS_ADMIN"
  | "VISA_ADMIN"
  | "MEDIA_ADMIN";

export type AdminTab =
  | "crm"
  | "packages"
  | "countries"
  | "departures"
  | "flights"
  | "hotels"
  | "gallery"
  | "staff";

export interface RoleConfig {
  role: UserRole;
  label: string;
  badge: string;
  allowedTabs: AdminTab[];
  crmServiceFilter?: string;
  description: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  MASTER_ADMIN: {
    role: "MASTER_ADMIN",
    label: "Master Administrator",
    badge: "Master Admin",
    allowedTabs: ["crm", "packages", "countries", "departures", "flights", "hotels", "gallery", "staff"],
    description: "Full access across all modules, CRM leads, inventory, and staff accounts.",
  },
  TOURS_ADMIN: {
    role: "TOURS_ADMIN",
    label: "Tours & Packages Desk",
    badge: "Tours Desk",
    allowedTabs: ["crm", "packages", "countries", "departures"],
    crmServiceFilter: "Holiday Package",
    description: "Manage holiday packages, country cards, departures, and tour inquiries in CRM.",
  },
  FLIGHTS_ADMIN: {
    role: "FLIGHTS_ADMIN",
    label: "Ticketing & Flights Desk",
    badge: "Ticketing Desk",
    allowedTabs: ["crm", "flights"],
    crmServiceFilter: "Flight Ticket",
    description: "Manage airline partners, routes, flight deals, and flight inquiries in CRM.",
  },
  HOTELS_ADMIN: {
    role: "HOTELS_ADMIN",
    label: "Hotels & Stays Desk",
    badge: "Hotels Desk",
    allowedTabs: ["crm", "hotels"],
    crmServiceFilter: "Hotel Booking",
    description: "Manage hotel inventory, partner resorts, and hotel booking inquiries in CRM.",
  },
  VISA_ADMIN: {
    role: "VISA_ADMIN",
    label: "Visa Assistance Desk",
    badge: "Visa Desk",
    allowedTabs: ["crm"],
    crmServiceFilter: "Visa Assistance",
    description: "Review visa applicants, documentation checklists, and visa inquiries in CRM.",
  },
  MEDIA_ADMIN: {
    role: "MEDIA_ADMIN",
    label: "Media & Gallery Desk",
    badge: "Media Desk",
    allowedTabs: ["gallery"],
    description: "Manage tour photography, destination imagery, and promotional photo gallery.",
  },
};

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole | string;
  name: string;
  allowedTabs?: AdminTab[];
  crmServiceFilter?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export interface TwoFactorPendingPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  pending2FA: boolean;
  otpCode: string;
}

export const MASTER_BACKUP_CODE = "SKYWALK-MASTER-SECURE-2026";

export function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function sign2FATempToken(payload: TwoFactorPendingPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });
}

export function verify2FATempToken(token: string): TwoFactorPendingPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TwoFactorPendingPayload;
    if (decoded && decoded.pending2FA) return decoded;
    return null;
  } catch {
    return null;
  }
}

export function getAdminUserFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get("skywalk_admin_token")?.value || null;
  }

  if (!token) return null;
  return verifyToken(token);
}
