import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import RollOnRollRate from "@/app/helpers/models/rollandroll";
import Postcode from "@/app/helpers/models/postcode"; // make sure you have this model
import * as xlsx from "xlsx"; // ✅ correct


export async function POST(req) {
  try {
    await ConnectDb();

    const data = await req.formData(); // fetch file
    const file = data.get("file"); // "file" is form field name

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

    // convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // read excel
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Excel file is empty" });
    }

    // Prepare data for DB
    const bulkData = [];

    for (const row of rows) {
      const { postcode, label, baseprice, tones, toneprice } = row;

      if (!postcode || !label || !baseprice || !tones || !toneprice) continue; // skip invalid

      // Find postcode ID from DB
      const post = await Postcode.findOne({ postcode: postcode.trim() });
      if (!post) continue; // skip unknown postcodes

      bulkData.push({
        postId: post._id,
        label: label.trim(),
        baseprice: Number(baseprice),
        tones: Number(tones),
        toneprice: Number(toneprice),
      });
    }

    if (!bulkData.length) {
      return NextResponse.json({ success: false, message: "No valid data found" });
    }

    // Insert many
    await RollOnRollRate.insertMany(bulkData);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${bulkData.length} roll rates`,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return NextResponse.json({ success: false, message: "Bulk upload failed" }, { status: 500 });
  }
}
