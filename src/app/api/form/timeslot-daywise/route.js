import { NextResponse } from "next/server";
import {ConnectDb} from "@/app/helpers/DB/db";
import TimeSlotDefinition from "@/app/helpers/models/TimeSlotsDefinition-daywise";

export async function POST(req) {
  try {
    
    await ConnectDb();
    const body = await req.json();
    const { dayOfWeek, startTime, endTime } = body;

    const toMinutes = (time) => {
      const [h, m] = time.split(":");
      return Number(h) * 60 + Number(m);
    };

    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { error: "End time must be greater than start time" },
        { status: 400 }
      );
    }

    // Check overlapping slots
    const conflict = await TimeSlotDefinition.findOne({
      dayOfWeek,
      startMinutes: { $lt: endMinutes },
      endMinutes: { $gt: startMinutes },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time range overlaps with an existing slot" },
        { status: 400 }
      );
    }

    const slot = await TimeSlotDefinition.create({
      dayOfWeek,
      startMinutes,
      endMinutes,
      startTime,
      endTime,
    });

    return NextResponse.json({ success: true, data: slot }, { status: 201 });
  } catch (err) {
    console.log("Error creating timeslot:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




export async function GET() {
  try {
    await ConnectDb();

    const slots = await TimeSlotDefinition
      .find()
      .sort({ dayOfWeek: 1, startMinutes: 1 });

    return NextResponse.json({ success: true, data: slots });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




