import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import Size from "@/app/helpers/models/size";
import Category from "@/app/helpers/models/category";

// CREATE size
export async function POST(req) {
  try {
    await ConnectDb();
    const { size, categoryId } = await req.json();

    if (!size || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Size and Category are required" },
        { status: 400 }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const newSize = await Size.create({ size, category: categoryId });
    return NextResponse.json(
      { success: true, message: "Size created successfully", data: newSize },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// READ all sizes
export async function GET() {
  try {
    await ConnectDb();

    const sizes = await Size.find({})
      .populate("category", "category")
      .sort({ "category": 1, "size": 1 }); // sort first by category then size

    return NextResponse.json(
      { success: true, data: sizes },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// UPDATE size
export async function PUT(req) {
  try {
    await ConnectDb();
    const { id, size, categoryId } = await req.json();

    if (!id || !size || !categoryId) {
      return NextResponse.json(
        { success: false, message: "ID, Size and Category are required" },
        { status: 400 }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const updatedSize = await Size.findByIdAndUpdate(
      id,
      { size, category: categoryId },
      { new: true }
    );

    if (!updatedSize) {
      return NextResponse.json(
        { success: false, message: "Size not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Size updated successfully", data: updatedSize },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE size
export async function DELETE(req) {
  try {
    await ConnectDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const deletedSize = await Size.findByIdAndDelete(id);

    if (!deletedSize) {
      return NextResponse.json(
        { success: false, message: "Size not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Size deleted successfully", data: deletedSize },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
