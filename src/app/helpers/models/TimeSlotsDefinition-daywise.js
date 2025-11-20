// models/TimeSlotDefinition.js
import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: [
        'monday','tuesday','wednesday','thursday',
        'friday','saturday','sunday'
      ],
      required: true,
      lowercase: true,
      trim: true,
    },

    startMinutes: { type: Number, required: true },
    endMinutes: { type: Number, required: true },

    startTime: { type: String, required: true },  // for UI
    endTime: { type: String, required: true },    // for UI

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TimeSlotSchema.index({ dayOfWeek: 1, startMinutes: 1 });

export default mongoose.models.TimeSlotDefinition ||
  mongoose.model("TimeSlotDefinition", TimeSlotSchema);
