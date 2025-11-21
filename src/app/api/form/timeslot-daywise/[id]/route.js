import { NextResponse } from "next/server";
import {ConnectDb} from "@/app/helpers/DB/db";
import TimeSlotDefinition from "@/app/helpers/models/TimeSlotsDefinition-daywise";

export async function GET(req, { params }) {
  try {
    await ConnectDb();

    const { day } = params;

    const slots = await TimeSlotDefinition.find({
      dayOfWeek: day.toLowerCase()
    }).sort({ startMinutes: 1 });

    return NextResponse.json({ success: true, data: slots });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



i

export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const { id } = params;
    const { startTime, endTime } = await req.json();

    const toMinutes = (t) => {
      const [h, m] = t.split(":");
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

    const existing = await TimeSlotDefinition.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    // check overlap with other slots
    const conflict = await TimeSlotDefinition.findOne({
      _id: { $ne: id },
      dayOfWeek: existing.dayOfWeek,
      startMinutes: { $lt: endMinutes },
      endMinutes: { $gt: startMinutes },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Slot time overlaps with another slot" },
        { status: 400 }
      );
    }

    const updated = await TimeSlotDefinition.findByIdAndUpdate(
      id,
      { startTime, endTime, startMinutes, endMinutes },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    const { id } = params;

    await TimeSlotDefinition.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Slot deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
