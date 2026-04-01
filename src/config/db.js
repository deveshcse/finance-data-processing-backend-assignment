import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * @description Establishes a connection to MongoDB using Mongoose.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
