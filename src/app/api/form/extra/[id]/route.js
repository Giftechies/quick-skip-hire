// app/api/form/extra/[id]/route.js
import {ConnectDb} from "@/app/helpers/DB/db";
import Extra from "@/app/helpers/models/extra";
import { NextResponse } from "next/server";

// DELETE Extra by ID
export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Extra.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Extra not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Extra deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE Extra by ID
export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    if (!body.label || body.price == null) {
      return NextResponse.json(
        { success: false, error: "Label and price are required" },
        { status: 400 }
      );
    }

    const updated = await Extra.findByIdAndUpdate(
      id,
      { label: body.label, price: body.price },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Extra not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Extra updated successfully", data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("UPDATE error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
