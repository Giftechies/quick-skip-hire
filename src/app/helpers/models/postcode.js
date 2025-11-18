import mongoose, { Schema } from "mongoose";
import Rates from "./rates"

const postSchema = new Schema({
  postcode: {
    type: String,
    required: true,
    unique: true,
  },
});



postSchema.pre("findOneAndDelete",async function(next){
  try {
    const data = this.getQuery()
    const postId = data._id
    if(postId){
      await Rates.deleteMany({postId:postId})
    }

    next()
    
  } catch (error) {
    next(error)
    
  }
})

const Postcode = mongoose.models.Postcode || mongoose.model("Postcode", postSchema);

export default Postcode;
