import { ConnectDb } from "@/app/helpers/DB/db";
import settingRate from "@/app/helpers/models/settingRate";
import Size from "@/app/helpers/models/size";
import Category from "@/app/helpers/models/category";


// ✅ POST — Create a new settingRate
export async function POST(req) {
  await ConnectDb();
  try {
    const { categoryId, sizeId, rate } = await req.json();

    if (!categoryId || !sizeId || rate === undefined) {
      return Response.json(
        { success: false, message: "categoryId, sizeId, and rate are required" },
        { status: 400 }
      );
    }

    const newSettingRate = await settingRate.create({
      categoryId,
      sizeId,
      rate: Number(rate),
    });

    return Response.json({ success: true, data: newSettingRate });
  } catch (error) {
    console.error("POST /settingrate error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET — Fetch all settingRates
export async function GET() {
  await ConnectDb();
  try {
    const rates = await settingRate
      .find({})
      .populate({ path: "categoryId", select: "category" })
      .populate({ path: "sizeId", select: "size" });

    return Response.json({ success: true, data: rates });
  } catch (error) {
    console.error("GET /settingrate error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT — Update a settingRate
export async function PUT(req) {
  await ConnectDb();
  try {
    const { id, categoryId, sizeId, rate } = await req.json();

    if (!id || !categoryId || !sizeId || rate === undefined) {
      return Response.json(
        { success: false, message: "id, categoryId, sizeId, and rate are required" },
        { status: 400 }
      );
    }

    const updatedSettingRate = await settingRate.findByIdAndUpdate(
      id,
      { categoryId, sizeId, rate: Number(rate) },
      { new: true }
    );

    if (!updatedSettingRate) {
      return Response.json(
        { success: false, message: "Setting rate not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updatedSettingRate });
  } catch (error) {
    console.error("PUT /settingrate error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete a settingRate
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

    await settingRate.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Setting rate deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /settingrate error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
