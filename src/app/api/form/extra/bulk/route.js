import {ConnectDb} from "@/app/helpers/DB/db";
import Extra from "@/app/helpers/models/extra";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req) {
  try {
    await ConnectDb();

    // Get the uploaded file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    // Read file as array buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json(
        { success: false, error: "File is empty" },
        { status: 400 }
      );
    }

    const insertedExtras = [];
    const skipped = [];

    for (let row of rows) {
      // row should have { label, price }
      if (!row.label || row.price == null) {
        skipped.push(row);
        continue;
      }

      // Check if label already exists
      const exists = await Extra.findOne({ label: row.label });
      if (exists) {
        skipped.push(row);
        continue;
      }

      const newExtra = new Extra({ label: row.label, price: row.price });
      await newExtra.save();
      insertedExtras.push(newExtra);
    }

    return NextResponse.json({
      success: true,
      inserted: insertedExtras.length,
      skipped,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
