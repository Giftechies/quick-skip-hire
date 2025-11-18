// File: src/app/api/form/rates/route.js
import { ConnectDb } from "@/app/helpers/DB/db";
import Rate from "@/app/helpers/models/rates";
import Postcode from "@/app/helpers/models/postcode";
import Category from "@/app/helpers/models/category";
import Size from "@/app/helpers/models/size";

// POST - Create a new rate
export async function POST(req) {
  await ConnectDb();
  try {
    const { postId, categoryId, sizeId, rate } = await req.json();

    if (!postId || !categoryId || !sizeId || rate === undefined) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newRate = await Rate.create({
      postId,
      categoryId,
      sizeId,
      rate: Number(rate),
    });

    return Response.json({ success: true, data: newRate });
  } catch (error) {
    console.error("POST /rates error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all rates with populated fields
export async function GET() {
  await ConnectDb();
  try {
    const rates = await Rate.find({})
      .populate({ path: "postId", select: "postcode" })
      .populate({ path: "categoryId", select: "category" })
      .populate({ path: "sizeId", select: "size" });
  
    return Response.json({ success: true, data: rates });
  } catch (error) {
    console.error("GET /rates error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a rate
export async function PUT(req) {
  await ConnectDb();
  try {
    const { id, postId, categoryId, sizeId, rate } = await req.json();

    if (!id || !postId || !categoryId || !sizeId || rate === undefined) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedRate = await Rate.findByIdAndUpdate(
      id,
      { postId, categoryId, sizeId, rate: Number(rate) },
      { new: true }
    );

    return Response.json({ success: true, data: updatedRate });
  } catch (error) {
    console.error("PUT /rates error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a rate
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

    await Rate.findByIdAndDelete(id);

    return Response.json({ success: true, message: "Rate deleted successfully" });
  } catch (error) {
    console.error("DELETE /rates error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
