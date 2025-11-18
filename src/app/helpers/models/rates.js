import mongoose, { model, Schema } from "mongoose";

const rateSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Postcode", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    sizeId: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    rate: { type: Number, required: true },
  },
 
);

const Rate = mongoose.models.Rate || mongoose.model("Rate", rateSchema);

export default Rate;