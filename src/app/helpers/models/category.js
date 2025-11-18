import mongoose, { Schema }  from "mongoose";
import Size from "./size";
import Rates from "./rates";
 


const categorySchema = new Schema({
    category:{
        type:String,required:true,
        unique:true
    },
})

categorySchema.pre("findOneAndDelete", async function(next) {
 try {
       const categoryId = this.getQuery()._id;
 if(categoryId){
       await Size.deleteMany({category:categoryId})
    await Rates.deleteMany({categoryId:categoryId})
 }
    next()
 } catch (error) {
    next(error)
    
 }
    
})


const Category = mongoose.models.Category || mongoose.model("Category",categorySchema);

export default Category;