import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.log("MONGO_URI is missing");
      process.exit(1);
    }
    await mongoose.connect(MONGO_URI);
    console.log("--- Connected to MongoDB ---");
  } catch (err) {
    console.log("--- Failed to connect to MongoDB ---");
    console.log("Error: ", err);
    process.exit(1);
  }
};

export default connectDB;
