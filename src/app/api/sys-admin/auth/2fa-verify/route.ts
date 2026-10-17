import { NextRequest, NextResponse } from "next/server";
import {
  verify2FATempToken,
  signToken,
  ROLE_CONFIGS,
  MASTER_BACKUP_CODE,
} from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const tempToken = body.tempToken;
    const code = body.code?.toString().trim().replace(/[\s-]/g, "");

    if (!tempToken || !code) {
      return NextResponse.json(
        { error: "Verification code and session token are required." },
        { status: 400 }
      );
    }

    const decoded = verify2FATempToken(tempToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "2FA verification session has expired. Please sign in again." },
        { status: 401 }
      );
    }

    const isMatch =
      code === decoded.otpCode ||
      code.toUpperCase() === MASTER_BACKUP_CODE.replace(/[\s-]/g, "").toUpperCase();

    if (!isMatch) {
      logger.warn("2FA verification failed for user", { email: decoded.email });
      return NextResponse.json(
        { error: "Invalid 6-digit code. Please check and try again or use your master backup key." },
        { status: 400 }
      );
    }

    // Success! Issue full token
    const roleConfig = ROLE_CONFIGS[decoded.role];
    const token = signToken({
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      allowedTabs: roleConfig.allowedTabs,
      crmServiceFilter: roleConfig.crmServiceFilter,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
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

    logger.info("2FA verification successful for Master Admin", { email: decoded.email });
    return response;
  } catch (error) {
    logger.error("Error in 2FA verification", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during verification." },
      { status: 500 }
    );
  }
}
