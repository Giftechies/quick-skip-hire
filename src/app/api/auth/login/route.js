// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import userModel from "@/app/helpers/models/user";
// import { ConnectDb } from "../../../helper/db";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await ConnectDb();

//     const { username, password } = await req.json();

//     // 1. Check if user exists
//     const existUser = await userModel.findOne({ username });
//     if (!existUser) {
//       return NextResponse.json(
//         { success: false, message: "User not exist!" },
//         { status: 404 }
//       );
//     }

//     // 2. Compare password
//     const isPasswordValid = await bcrypt.compare(password, existUser.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid password" },
//         { status: 401 }
//       );
//     }

//     // 3. Generate JWT
//     const token = jwt.sign(
//       { username: existUser.username, id: existUser._id },
//       process.env.JWT_KEY,
//       { expiresIn: "60m" }
//     );

//     // 4. Set cookie (HttpOnly for security)
//     cookies().set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60, // 1 hour
//       path: "/",
//     });

//     // 5. Return success
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Login successful",
//         user: {
//           id: existUser._id,
//           username: existUser.username,
//           role:existUser.role,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     return NextResponse.json(
//       { success: false, message: "Login failed!" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { ConnectDb } from "../../../helper/db";
import userModel from "@/app/helpers/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await ConnectDb();

    const { username, password } = await req.json();

    const existUser = await userModel.findOne({ username });
    if (!existUser)
      return NextResponse.json({ success: false, message: "User not exist!" }, { status: 404 });

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid)
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });

    const token = jwt.sign({ username: existUser.username, id: existUser._id,role:existUser.role }, process.env.JWT_KEY, {
      expiresIn: "120m",
    });

    // ✅ Create response and attach cookie properly
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: existUser._id, username: existUser.username, role: existUser.role },
    });
   

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Login failed!" }, { status: 500 });
  }
}
