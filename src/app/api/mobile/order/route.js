import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import Order from "@/app/helpers/models/order";
import { ConnectDb } from "@/app/helpers/DB/db";

/**
 * Extract JWT from Authorization header (mobile)
 */
function getTokenFromHeader(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;

  return authHeader.split(" ")[1];
}

/**
 * Verify JWT
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(req) {
  try {
    await ConnectDb();

    // 1️⃣ Get token from header
    const token = getTokenFromHeader(req);
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          code: "TOKEN_MISSING",
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    // 2️⃣ Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_TOKEN",
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    // 3️⃣ Extract userId from token (NEVER from client)
    const userId = payload.sub || payload.userId;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_PAYLOAD",
          message: "User identity missing in token",
        },
        { status: 401 }
      );
    }

    // 4️⃣ Fetch orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).select('-customer');

    return NextResponse.json({
      success: true,
      orders, // return empty array if none
    });

  } catch (error) {
    console.error("Mobile Orders API Error:", error);

    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
