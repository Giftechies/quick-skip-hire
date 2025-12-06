import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import User from "@/app/helpers/models/user";

import { SignJWT } from "jose";

export async function POST(req) {
  try {
    await ConnectDb();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Secure password verify
    console.log(user.password,password);
    const isValid = user.password == password;
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Create JWT using jose
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      },
      { status: 200 }
    );

    // Set JWT cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
