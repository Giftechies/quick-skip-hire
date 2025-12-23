import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import User from "@/app/helpers/models/user";
import { ConnectDb } from "@/app/helpers/DB/db";

/* ================= HELPERS ================= */

function getToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function sanitizeUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isVerified: user.isVerified,
  };
}

/* ================= GET PROFILE ================= */

export async function GET(req) {
  try {
    await ConnectDb();

    const token = getToken(req);
    if (!token) {
      return NextResponse.json(
        { success: false, code: "TOKEN_MISSING" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, code: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    const userId = payload.sub || payload.userId;

    const user = await User.findById(userId).select(
      "firstName lastName email phoneNumber role isVerified"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error("Mobile Profile GET Error:", error);
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE PROFILE ================= */

export async function PUT(req) {
  try {
    await ConnectDb();

    const token = getToken(req);
    if (!token) {
      return NextResponse.json(
        { success: false, code: "TOKEN_MISSING" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, code: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    const userId = payload.sub || payload.userId;

    const body = await req.json();
    const updateData = {};

    // Whitelist allowed fields only
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.phoneNumber) updateData.phoneNumber = body.phoneNumber;
    if (body.email) updateData.email = body.email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("firstName lastName email phoneNumber role isVerified");

    if (!user) {
      return NextResponse.json(
        { success: false, code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error("Mobile Profile PUT Error:", error);
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
