export const dynamic = "force-dynamic"; // ← add at the top of your file

import { NextResponse } from "next/server";
import settingRate from "@/app/helpers/models/settingRate";
import settingRoll from "@/app/helpers/models/settingroll";
import Rate from "@/app/helpers/models/rates";
import RollOnRollRate from "@/app/helpers/models/rollandroll";
import Category from "@/app/helpers/models/category";
import Postcode from "@/app/helpers/models/postcode";
import Size from "@/app/helpers/models/size";
import {ConnectDb} from "@/app/helpers/DB/db";

/**
 * NOTE: refactor preserves original logic exactly:
 * - still fetches full collections and filters in-memory
 * - same fallback behavior for "roll and roll off" and for defaultRates -> "skip delivery"
 * This change is purely structural/readability/robustness — not behavioral.
 */

const normalize = (s) => (typeof s === "string" ? s.trim().toLowerCase() : s);

async function getRollAndRollRatesForPostcode(postcode) {
  // Matches original logic: load all, try to find matching postcode, otherwise return defaultRolls
  const all = await RollOnRollRate.find({}).populate("postId", "postcode").lean();
  const filtered = all.filter((x) => x.postId?.postcode?.trim().toLowerCase() === postcode);

  if (filtered.length > 0) {
    return filtered;
  }

  const defaultRolls = await settingRoll.find({}).lean();
  return defaultRolls;
}

async function getStandardRatesForPostcodeAndJob(postcode, jobType) {
  // Matches original logic: load all Rate documents with the same populate selection,
  // filter in-memory; if none, load defaultRates and apply same in-memory fallback logic.
  const allRates = await Rate.find({})
    .populate({ path: "postId", select: "postcode" })
    .populate({ path: "categoryId", select: "category" })
    .populate({ path: "sizeId", select: "size" })
    .lean();

  const matching = allRates.filter(
    (x) =>
      x.postId?.postcode?.trim().toLowerCase() === postcode &&
      x.categoryId?.category?.trim().toLowerCase() === jobType
  );

  if (matching.length > 0) {
    return matching;
  }

  const defaultRates = await settingRate.find({}).populate("categoryId sizeId").lean();

  // first try: rates matching jobType
  let rates = defaultRates.filter(
    (r) => r.categoryId?.category?.trim().toLowerCase() === jobType
  );

  // fallback exactly as original: if no rates and jobType !== "skip delivery" then try "skip delivery"
  if (rates.length === 0 && jobType !== "skip delivery") {
    rates = defaultRates.filter(
      (r) => r.categoryId?.category?.trim().toLowerCase() === "skip delivery"
    );
  }

  return rates;
}

export async function GET(req) {
  try {
    await ConnectDb();

    const { searchParams } = new URL(req.url);
    const rawPostcode = searchParams.get("postcode");
    const rawJobType = searchParams.get("jobType");

    const postcode = normalize(rawPostcode);
    const jobType = normalize(rawJobType);

    if (!postcode || !jobType) {
      return NextResponse.json(
        { success: false, message: "postcode and jobType are required" },
        { status: 400 }
      );
    }

    let rates = [];

    if (jobType === "roll and roll off") {
      rates = await getRollAndRollRatesForPostcode(postcode);
    } else {
      rates = await getStandardRatesForPostcodeAndJob(postcode, jobType);
    }

    return NextResponse.json({
      success: true,
      message: "Rates fetched successfully",
      data: rates,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Fetching rates failed",
        data: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
