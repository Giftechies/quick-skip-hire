import { NextResponse } from "next/server";
import Order from "@/app/helpers/models/order";
import { ConnectDb } from "@/app/helpers/DB/db";

export async function GET(req, { params }) {
  try {
    await ConnectDb();
    const { userId } =await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return NextResponse.json(
        { success: false, message: "No orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
