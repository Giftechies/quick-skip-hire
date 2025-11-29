// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

const SESSION_COOKIE = "auth_token";

export async function POST() {
  try {
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Logout successful.",
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
