import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  signToken,
  verifyPassword,
  ROLE_CONFIGS,
  UserRole,
  sign2FATempToken,
  generate6DigitCode,
} from "@/lib/auth";
import { logger } from "@/lib/logger";

export const DEFAULT_SERVICE_ACCOUNTS = [
  {
    email: "admin@skywalkholidays.com",
    password: "admin123",
    name: "Master Administrator",
    role: "MASTER_ADMIN" as UserRole,
  },
  {
    email: "tours@skywalkholidays.com",
    password: "tours123",
    name: "Tours & Holiday Packages Desk",
    role: "TOURS_ADMIN" as UserRole,
  },
  {
    email: "flights@skywalkholidays.com",
    password: "flights123",
    name: "Ticketing & Flights Desk",
    role: "FLIGHTS_ADMIN" as UserRole,
  },
  {
    email: "hotels@skywalkholidays.com",
    password: "hotels123",
    name: "Hotels & Stays Desk",
    role: "HOTELS_ADMIN" as UserRole,
  },
  {
    email: "visa@skywalkholidays.com",
    password: "visa123",
    name: "Visa Assistance Specialist",
    role: "VISA_ADMIN" as UserRole,
  },
  {
    email: "media@skywalkholidays.com",
    password: "media123",
    name: "Media & Content Desk",
    role: "MEDIA_ADMIN" as UserRole,
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // 1. Check predefined department service accounts
    const serviceAccount = DEFAULT_SERVICE_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email && acc.password === password
    );

    if (serviceAccount) {
      const roleConfig = ROLE_CONFIGS[serviceAccount.role];

      // Enforce 2FA verification for Master Administrator
      if (serviceAccount.role === "MASTER_ADMIN") {
        const otpCode = generate6DigitCode();
        const tempToken = sign2FATempToken({
          userId: `usr-${serviceAccount.role.toLowerCase()}`,
          email: serviceAccount.email,
          name: serviceAccount.name,
          role: serviceAccount.role,
          pending2FA: true,
          otpCode,
        });

        logger.info("2FA Code Generated for Master Admin", { email, otpCode });

        return NextResponse.json({
          success: true,
          requires2FA: true,
          tempToken,
          email: serviceAccount.email,
          name: serviceAccount.name,
          message: "Two-Factor Authentication (2FA) is required for Master Admin.",
          hintCode: otpCode,
        });
      }

      // Other department accounts log in directly
      const token = signToken({
        userId: `usr-${serviceAccount.role.toLowerCase()}`,
        email: serviceAccount.email,
        name: serviceAccount.name,
        role: serviceAccount.role,
        allowedTabs: roleConfig.allowedTabs,
        crmServiceFilter: roleConfig.crmServiceFilter,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: `usr-${serviceAccount.role.toLowerCase()}`,
          name: serviceAccount.name,
          email: serviceAccount.email,
          role: serviceAccount.role,
          badge: roleConfig.badge,
          allowedTabs: roleConfig.allowedTabs,
          crmServiceFilter: roleConfig.crmServiceFilter,
        },
        token,
      });

      response.cookies.set("skywalk_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      logger.info("Service user logged in successfully", { email, role: serviceAccount.role });
      return response;
    }

    // 2. Check Database user if Prisma client is initialized
    let user = null;
    try {
      if (prisma && prisma.user && typeof prisma.user.findUnique === "function") {
        user = await prisma.user.findUnique({ where: { email } });
      }
    } catch (e) {
      logger.warn("Prisma lookup skipped in admin login", e);
    }

    if (user) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (isValid) {
        const userRole: UserRole =
          user.role === "SUPER_ADMIN" ? "MASTER_ADMIN" : "TOURS_ADMIN";
        const roleConfig = ROLE_CONFIGS[userRole];

        const token = signToken({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: userRole,
          allowedTabs: roleConfig.allowedTabs,
          crmServiceFilter: roleConfig.crmServiceFilter,
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: userRole,
            badge: roleConfig.badge,
            allowedTabs: roleConfig.allowedTabs,
            crmServiceFilter: roleConfig.crmServiceFilter,
          },
          token,
        });

        response.cookies.set("skywalk_admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        logger.info("Database user logged in successfully", { email });
        return response;
      }
    }

    return NextResponse.json(
      { error: "Invalid email or password. Please check your credentials." },
      { status: 401 }
    );
  } catch (error) {
    logger.error("Admin login error", error);
    return NextResponse.json({ error: "An unexpected authentication error occurred." }, { status: 500 });
  }
}
