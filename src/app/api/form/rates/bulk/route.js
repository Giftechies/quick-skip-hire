import { ConnectDb } from "../../../../helper/db";
import Rate from "../@/app/helpers/models/rates";
import Postcode from "../@/app/helpers/models/postcode";
import Category from "../@/app/helpers/models/category";
import Size from "../@/app/helpers/models/size";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

export async function POST(req) {
  await ConnectDb();

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "File is empty" }, { status: 400 });
    }

    const insertedRates = [];
    const skipped = [];

    for (let row of rows) {
      // Expecting human-readable columns: Postcode, Category, Size, Rate
      const { Postcode: postcodeName, Category: categoryName, Size: sizeName, Rate: rate } = row;

      if (!postcodeName || !categoryName || !sizeName || rate === undefined) {
        skipped.push({ row, reason: "Missing required fields" });
        continue;
      }

      // Lookup IDs
      const post = await Postcode.findOne({ postcode: postcodeName });
      const category = await Category.findOne({ category: categoryName });
      const size = await Size.findOne({ size: sizeName });

      if (!post || !category || !size) {
        skipped.push({ row, reason: "Postcode, Category, or Size not found" });
        continue;
      }

      // Skip duplicates (same postId + categoryId + sizeId)
      const exists = await Rate.findOne({
        postId: post._id,
        categoryId: category._id,
        sizeId: size._id,
      });

      if (exists) {
        skipped.push({ row, reason: "Duplicate rate" });
        continue;
      }

      const newRate = new Rate({
        postId: post._id,
        categoryId: category._id,
        sizeId: size._id,
        rate: Number(rate),
      });

      await newRate.save();
      insertedRates.push(newRate);
    }

    return NextResponse.json({
      success: true,
      inserted: insertedRates.length,
      skipped,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
