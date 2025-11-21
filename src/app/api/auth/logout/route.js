// app/api/auth/logout/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serialize } from "cookie";

import { ConnectDb } from "@/app/helpers/DB/db";
import Session from "@/app/helpers/models/Session";

const SESSION_COOKIE_NAME = "site_session";

export async function POST() {
  await ConnectDb();

  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      // Remove server-side session record
      await Session.deleteOne({ token: sessionToken });
    }

    // Always clear cookie — even if no DB record exists
    const expiredCookie = serialize(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return new NextResponse(
      JSON.stringify({ success: true, message: "Logout successful." }),
      {
        status: 200,
        headers: { "Set-Cookie": expiredCookie },
      }
    );
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during logout." },
      { status: 500 }
    );
  }
}
