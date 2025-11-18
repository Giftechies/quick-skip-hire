import mongoose from "mongoose";

let isConnected = false;

export const ConnectDb = async () => {
  if (isConnected) {
    console.log("DB already connected");
    return;
  }

  const uri = process.env.MONGOOSE_URL;
  if (!uri) throw new Error("MONGO_URI missing");

  try {
    const connection = await mongoose.connect(uri, {
      dbName: "quick-skip-hire",
      bufferCommands: false,
    });

    isConnected = connection.connections[0].readyState === 1;
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    throw error;
  }
};
