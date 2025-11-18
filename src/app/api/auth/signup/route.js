import { NextResponse } from "next/server";
import userModel from "@/app/helpers/models/user";
import bcrypt from "bcryptjs"
import {ConnectDb} from "../../../helper/db"

export async function POST(req) {
  try {
    await ConnectDb();
    const { username, password } = await req.json();

    // Check if user already exists
    const existUser = await userModel.findOne({ username });
    if (existUser) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      }, { status: 400 });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new userModel({
      username,
      password: hashPassword,
    });
    await newUser.save();

    return NextResponse.json({
      success: true,
      message: "Register successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Registration failed",
    }, { status: 500 });
  }
}