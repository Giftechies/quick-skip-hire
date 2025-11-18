import mongoose from "mongoose";

const ExtraSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
});
const Extra = mongoose.models.Extra || mongoose.model("Extra", ExtraSchema);

export default Extra;
