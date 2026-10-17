import { NextRequest, NextResponse } from "next/server";
import {
  verify2FATempToken,
  sign2FATempToken,
  generate6DigitCode,
} from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const tempToken = body.tempToken;

    if (!tempToken) {
      return NextResponse.json({ error: "Session token required." }, { status: 400 });
    }

    const decoded = verify2FATempToken(tempToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "2FA session expired. Please sign in again." },
        { status: 401 }
      );
    }

    const newOtpCode = generate6DigitCode();
    const newTempToken = sign2FATempToken({
      ...decoded,
      otpCode: newOtpCode,
    });

    logger.info("Resent 2FA code for Master Admin", { email: decoded.email, newOtpCode });

    return NextResponse.json({
      success: true,
      tempToken: newTempToken,
      message: "New 6-digit verification code generated.",
      hintCode: newOtpCode,
    });
  } catch (error) {
    logger.error("Error in resending 2FA", error);
    return NextResponse.json(
      { error: "Failed to resend code." },
      { status: 500 }
    );
  }
}
