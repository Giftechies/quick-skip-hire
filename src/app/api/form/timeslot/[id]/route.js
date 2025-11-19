// src/app/api/slots/[id]/route.js

import { NextResponse } from "next/server";
import TimeSlotDefinition from "@/models/TimeSlotDefinition";
import connectDb from "@/lib/connectDb";
import mongoose from "mongoose";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Note: Using { params } to access the dynamic [id] segment
export async function PUT(req, { params }) {
  try {
    const { id } = params;

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid slot ID format." },
        { status: 400 }
      );
    }

    await connectDb();
    const body = await req.json();
    const { dayOfWeek, startTime, endTime } = body;

    // 2. Fetch the existing slot
    const existingSlot = await TimeSlotDefinition.findById(id);
    if (!existingSlot) {
      return NextResponse.json(
        { success: false, message: "Timeslot not found." },
        { status: 404 }
      );
    }

    // Determine the values to check against (use existing if not provided)
    const newDayOfWeek = dayOfWeek || existingSlot.dayOfWeek;
    const newStartTime = startTime || existingSlot.startTime;
    const newEndTime = endTime || existingSlot.endTime;

    // 3. Validate new time format if provided
    if (startTime && !timeRegex.test(newStartTime)) {
      return NextResponse.json(
        { success: false, message: "Invalid startTime format. Use 'HH:mm'." },
        { status: 400 }
      );
    }
    if (endTime && !timeRegex.test(newEndTime)) {
      return NextResponse.json(
        { success: false, message: "Invalid endTime format. Use 'HH:mm'." },
        { status: 400 }
      );
    }
    
    // 4. Create a temporary instance to compute minutes and run Mongoose validation
    const tempSlot = new TimeSlotDefinition({ 
        dayOfWeek: newDayOfWeek, 
        startTime: newStartTime, 
        endTime: newEndTime 
    });
    await tempSlot.validate(); // Computes startMinutes & endMinutes

    // 5. Check overlap (EXCLUDING the current slot's ID)
    const isOverlapping = await TimeSlotDefinition.overlapsExisting({
      dayOfWeek: newDayOfWeek,
      startMinutes: tempSlot.startMinutes,
      endMinutes: tempSlot.endMinutes,
      excludeId: id, // <--- This is the crucial part for updates
    });

    if (isOverlapping) {
      return NextResponse.json(
        { success: false, message: "Updated slot overlaps with another slot for this day." },
        { status: 400 }
      );
    }

    // 6. Update and save
    const updatedSlot = await TimeSlotDefinition.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true } // new: returns the updated doc; runValidators: triggers the pre-save hooks
    );

    return NextResponse.json(
      { success: true, message: "Timeslot updated successfully", data: updatedSlot },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Timeslot Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid slot ID format." },
        { status: 400 }
      );
    }

    await connectDb();

    // Find and delete the slot
    const deletedSlot = await TimeSlotDefinition.findByIdAndDelete(id);

    if (!deletedSlot) {
      return NextResponse.json(
        { success: false, message: "Timeslot not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Timeslot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Timeslot Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}