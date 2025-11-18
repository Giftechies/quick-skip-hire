import mongoose from "mongoose";

const settingrollSchema = new mongoose.Schema(
  {
   
    label: {
      type: String,
      required: true,
      trim: true, // e.g. "20/40yd mixed", "20/40yd wood"
    },
    baseprice: {
      type: Number,
      required: true,
    },
    tones: {
      type: Number,
      required: true,
    },
    toneprice: {
      type: Number,
      required: true,
    },
    // category is fixed, but if you still want to see it in data:
    category: {
      type: String,
      default: "Roll-on-roll-off",
      immutable: true, // prevent changing after creation
    },
  },
  { timestamps: true }
);

export default mongoose.models.settingRoll ||
  mongoose.model("settingRoll", settingrollSchema);
