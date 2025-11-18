import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,  
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin",
  },
});

// Prevent model overwrite error in Next.js hot reload
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
