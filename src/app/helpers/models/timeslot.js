import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }, 
    startSession: { type: String, enum: ['AM', 'PM'], required: true },
    endSession: { type: String, enum: ['AM', 'PM'], required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

TimeSlotSchema.index({ startTime: 1, endTime: 1 }); 
export default mongoose.models.TimeSlot || mongoose.model("TimeSlot", TimeSlotSchema);

