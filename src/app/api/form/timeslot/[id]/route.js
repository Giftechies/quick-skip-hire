import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import timeslot from "@/app/helpers/models/timeslot";

export async function PATCH(req, { params }) {
  try {
    await ConnectDb();
    const { id } = await params;

    const body = await req.json();
    const { startTime, endTime, startSession, endSession } = body;

    if (!startTime || !endTime || !startSession || !endSession) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updated = await timeslot.findByIdAndUpdate(
      id,
      {
        startTime,
        endTime,
        startSession,
        endSession,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Time slot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    
    
    const { id } = await params;

    const removed = await timeslot.findByIdAndDelete(id);

    if (!removed) {
      return NextResponse.json(
        { error: "Time slot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Time slot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
