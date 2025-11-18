import mongoose, { Schema } from "mongoose";
import Rates from "./rates";

const sizeSchema = new Schema({
  size: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Category
    ref: "Category",
    required: true,
  },
});

sizeSchema.pre("findOneAndDelete", async function(next){
 try {
   const sizeid = this.getQuery()._id;
if(sizeid){
    await Rates.deleteMany({sizeId:sizeid});
}
  next();
  
 } catch (error) {
  next(error)
  
 }
})

const Size = mongoose.models.Size || mongoose.model("Size", sizeSchema);

export default Size;
