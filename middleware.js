// middleware.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, role }

    return NextResponse.next();
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/orders/:path*", 
    "/api/admin/:path*"
  ],
};
