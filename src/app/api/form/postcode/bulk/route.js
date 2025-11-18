import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Postcode from "@/app/helpers/models/postcode";
import {ConnectDb} from "@/app/helpers/DB/db";

export async function POST(req) {
  try {
    // 1️⃣ Connect to MongoDB
    await ConnectDb();

    // 2️⃣ Get uploaded file
    const data = await req.formData();
    const file = data.get("file");
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 3️⃣ Parse Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length || !rows[0].postcode) {
      return NextResponse.json(
        { success: false, error: "Excel must have a 'postcode' column" },
        { status: 400 }
      );
    }

    // 4️⃣ Map Excel rows to Postcode documents
    const docs = rows.map((r) => ({ postcode: r.postcode }));

    // 5️⃣ Check existing postcodes in DB
    const existing = await Postcode.find({
      postcode: { $in: docs.map((d) => d.postcode) },
    }).select("postcode");

    const existingPostcodes = existing.map((e) => e.postcode);

    // 6️⃣ Prepare result arrays
    const report = [];

    // 7️⃣ Loop through docs
    for (const d of docs) {
      if (!d.postcode || d.postcode.toString().trim() === "") {
        report.push({
          postcode: d.postcode || null,
          status: "failed",
          reason: "Invalid postcode (empty or missing)",
        });
        continue;
      }

      if (existingPostcodes.includes(d.postcode)) {
        report.push({
          postcode: d.postcode,
          status: "skipped",
          reason: "Duplicate - already exists in database",
        });
        continue;
      }

      // If valid and not duplicate → insert
      try {
        await Postcode.create(d);
        report.push({
          postcode: d.postcode,
          status: "inserted",
          reason: "Successfully added",
        });
      } catch (err) {
        report.push({
          postcode: d.postcode,
          status: "failed",
          reason: "DB insert error",
        });
      }
    }

    // 8️⃣ Final response
    return NextResponse.json({
      success: true,
      total: docs.length,
      inserted: report.filter((r) => r.status === "inserted").length,
      skipped: report.filter((r) => r.status === "skipped").length,
      failed: report.filter((r) => r.status === "failed").length,
      details: report,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Bulk import failed" },
      { status: 500 }
    );
  }
}
