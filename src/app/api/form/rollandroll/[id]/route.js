import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import RollOnRollRate from "@/app/helpers/models/rollandroll";

// ✅ Update (PUT) — /api/rollrate/:id
export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const { id } = params;
    const body = await req.json();

    const updated = await RollOnRollRate.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rate updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating Roll-on-roll-off rate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update rate" },
      { status: 500 }
    );
  }
}

// ✅ Delete (DELETE) — /api/rollrate/:id
export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    const { id } = params;

    const deleted = await RollOnRollRate.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Roll-on-roll-off rate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete rate" },
      { status: 500 }
    );
  }
}
