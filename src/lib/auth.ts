import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "skywalk_holidays_super_secret_jwt_key_2026";

export type UserRole = "MASTER_ADMIN" | "SALES_ADMIN";

export type AdminTab =
  | "crm"
  | "packages"
  | "countries"
  | "departures"
  | "flights"
  | "hotels"
  | "gallery"
  | "staff"
  | "settings";

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
    label: "Admin Login",
    badge: "Admin",
    allowedTabs: ["crm", "packages", "countries", "departures", "flights", "hotels", "gallery", "settings", "staff"],
    description: "Full access across all modules, CRM leads, inventory, site settings, and staff accounts.",
  },
  SALES_ADMIN: {
    role: "SALES_ADMIN",
    label: "Sales Login",
    badge: "Sales Desk",
    allowedTabs: ["crm", "packages", "countries", "departures", "flights", "hotels"],
    description: "Manage all customer inquiries in CRM, holiday packages, departures, flights, and hotels.",
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

  if (token) {
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // Fallback: check admin session cookie if logged into dashboard
  const isLoggedCookie = req.cookies.get("skywalk_admin_logged")?.value;
  if (isLoggedCookie === "true") {
    return {
      userId: "admin-session",
      email: "skywalktoursandtravels32@gmail.com",
      role: "MASTER_ADMIN",
      name: "Administrator",
    };
  }

  return null;
}
