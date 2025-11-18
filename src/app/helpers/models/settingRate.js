import mongoose, { model, Schema } from "mongoose";

const settingrateSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    sizeId: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    rate: { type: Number, required: true },
  },
 
);

const settingRate = mongoose.models.settingRate || mongoose.model("settingRate", settingrateSchema);

export default settingRate;