import { ConnectDb } from "@/app/helpers/DB/db";
import settingroll from "@/app/helpers/models/settingroll";

// ✅ POST — Create a new settingroll
export async function POST(req) {
  await ConnectDb();
  try {
    const { label, baseprice, tones, toneprice } = await req.json();

    if (!label || baseprice === undefined || tones === undefined || toneprice === undefined) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newRoll = await settingroll.create({
      label,
      baseprice: Number(baseprice),
      tones: Number(tones),
      toneprice: Number(toneprice),
    });

    return Response.json({ success: true, data: newRoll });
  } catch (error) {
    console.error("POST /settingroll error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET — Fetch all settingRolls
export async function GET() {
  await ConnectDb();
  try {
    const rolls = await settingroll.find({});
    return Response.json({ success: true, data: rolls });
  } catch (error) {
    console.error("GET /settingroll error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT — Update a settingroll
export async function PUT(req) {
  await ConnectDb();
  try {
    const { id, label, baseprice, tones, toneprice } = await req.json();

    if (!id || !label || baseprice === undefined || tones === undefined || toneprice === undefined) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedRoll = await settingroll.findByIdAndUpdate(
      id,
      { label, baseprice: Number(baseprice), tones: Number(tones), toneprice: Number(toneprice) },
      { new: true }
    );

    if (!updatedRoll) {
      return Response.json(
        { success: false, message: "Roll not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updatedRoll });
  } catch (error) {
    console.error("PUT /settingroll error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete a settingroll
export async function DELETE(req) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    await settingroll.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Roll deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /settingroll error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
