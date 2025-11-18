import { NextResponse } from "next/server";
import {ConnectDb} from "@/app/helpers/DB/db";
import Extra from "@/app/helpers/models/extra";
import * as XLSX from "xlsx"; // read Excel
import { writeFile, unlink } from "fs/promises";
import path from "path";

// ✅ Get all extras
export async function GET() {
  try {
    await ConnectDb();
    const extras = await Extra.find().sort({ label: 1 });
    return NextResponse.json({ success: true, data: extras });
  } catch (error) {
    console.error("GET /extras error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch extras" },
      { status: 500 }
    );
  }
}

// ✅ Create new extra
export async function POST(req) {
  try {
    await ConnectDb();

    // Check if file upload (for bulk import)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file) {
        return NextResponse.json(
          { success: false, message: "No file uploaded" },
          { status: 400 }
        );
      }

      // Save file temporarily
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "tmp");
      const filePath = path.join(uploadDir, file.name);

      await writeFile(filePath, buffer);

      // Read Excel data
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Clean up file after use
      await unlink(filePath);

      // Validate & insert
      if (!data.length) {
        return NextResponse.json(
          { success: false, message: "Empty Excel file" },
          { status: 400 }
        );
      }

      const formatted = data.map((item) => ({
        label: item.label || item.Label || item.name,
        price: Number(item.price || item.Price || 0),
      }));

      const inserted = await Extra.insertMany(formatted, { ordered: false });

      return NextResponse.json({
        success: true,
        message: `${inserted.length} extras imported successfully`,
        data: inserted,
      });
    }

    // Otherwise, normal single create
    const body = await req.json();
    if (!body.label || !body.price) {
      return NextResponse.json(
        { success: false, message: "Label and price are required" },
        { status: 400 }
      );
    }

    const newExtra = await Extra.create(body);
    return NextResponse.json({ success: true, data: newExtra }, { status: 201 });
  } catch (error) {
    console.error("POST /extras error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create/import extras" },
      { status: 500 }
    );
  }
}

// ✅ Update extra
export async function PUT(req) {
  try {
    await ConnectDb();
    const { _id, label, price } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Missing _id" },
        { status: 400 }
      );
    }

    const updated = await Extra.findByIdAndUpdate(
      _id,
      { label, price },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Extra not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /extras error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update extra" },
      { status: 500 }
    );
  }
}

// ✅ Delete extra
export async function DELETE(req) {
  try {
    await ConnectDb();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id" },
        { status: 400 }
      );
    }

    const deleted = await Extra.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Extra not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Extra deleted" });
  } catch (error) {
    console.error("DELETE /extras error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete extra" },
      { status: 500 }
    );
  }
}
