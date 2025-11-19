import { NextResponse } from "next/server";
import TimeSlotDefinition from "@/models/TimeSlotDefinition";
import connectDb from "@/lib/connectDb";

// Strict "HH:mm" format validation
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { dayOfWeek, startTime, endTime, label } = body;

    // 1. Validate required fields
    if (!dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "dayOfWeek, startTime and endTime are required." },
        { status: 400 }
      );
    }

    // 2. Validate HH:mm strict format
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { success: false, message: "Invalid time format. Use 'HH:mm' in 24-hour format." },
        { status: 400 }
      );
    }

    // Create instance (pre-validate computes minutes)
    const slot = new TimeSlotDefinition({
      dayOfWeek,
      startTime,
      endTime,
      label
    });

    // Trigger validation → computes startMinutes & endMinutes
    await slot.validate();

    // 3. Check overlap
    const isOverlapping = await TimeSlotDefinition.overlapsExisting({
      dayOfWeek,
      startMinutes: slot.startMinutes,
      endMinutes: slot.endMinutes
    });

    if (isOverlapping) {
      return NextResponse.json(
        { success: false, message: "Slot overlaps with an existing slot for this day." },
        { status: 400 }
      );
    }

    // 4. Save slot
    const saved = await slot.save();

    return NextResponse.json(
      { success: true, message: "Timeslot created successfully", data: saved },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create Timeslot Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}



// src/app/api/slots/route.js

// ... (Existing imports: NextResponse, TimeSlotDefinition, connectDb)

export async function GET(req) {
  try {
    await connectDb();

    // 1. Get query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const dayFilter = searchParams.get('dayOfWeek');

    const query = {};
    if (dayFilter) {
      // 2. Build query object if a day filter is present
      query.dayOfWeek = dayFilter;
    }

    // 3. Fetch slots based on the query, sorted by start time
    const slots = await TimeSlotDefinition.find(query).sort({ startMinutes: 1 });

    if (slots.length === 0 && dayFilter) {
      return NextResponse.json(
        { success: true, message: `No slots found for ${dayFilter}.`, data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Timeslots retrieved successfully", data: slots },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Timeslots Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}