
// api/auth/otp/verify/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { serialize } from "cookie";

import { ConnectDb } from "@/app/helpers/DB/db";
import User from "@/app/helpers/models/user";
import OtpCode from "@/app/helpers/models/OtpCode";

const SESSION_COOKIE = "auth_token";
const TOKEN_LIFE_DAYS = 7;

export async function POST(request) {
  await ConnectDb();

  try {
    const { email, otpCode } = await request.json();

    if (!email || !otpCode) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist." },
        { status: 404 }
      );
    }

    const otpRecord = await OtpCode.findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(otpCode, otpRecord.hashedOtpCode);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 401 }
      );
    }

    await OtpCode.deleteOne({ _id: otpRecord._id });

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = crypto.randomBytes(32).toString("hex");

    const cookie = serialize(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: TOKEN_LIFE_DAYS * 24 * 60 * 60,
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        role: user.role,
      }),
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
