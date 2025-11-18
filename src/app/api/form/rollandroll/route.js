import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import RollOnRollRate from "@/app/helpers/models/rollandroll";
import Postcode from "@/app/helpers/models/postcode";

// ✅ Connect to MongoDB
export async function GET() {
  try {
    await ConnectDb();

    const data = await RollOnRollRate.find().populate("postId", "postcode");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching Roll-on-roll-off rates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}

// ✅ Create new Roll-on-roll-off rate
export async function POST(req) {
  try {
    await ConnectDb();
    const body = await req.json();

    const { postId, label, baseprice, tones, toneprice } = body;

    if (!postId || !label || !baseprice || !tones || !toneprice) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newRate = await RollOnRollRate.create({
      postId,
      label,
      baseprice,
      tones,
      toneprice,
    });

    return NextResponse.json({
      success: true,
      message: "Roll-on-roll-off rate created successfully",
      data: newRate,
    });
  } catch (error) {
    console.error("Error creating Roll-on-roll-off rate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create rate" },
      { status: 500 }
    );
  }
}
