import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

/**
 * @description Establishes a connection to MongoDB using Mongoose.
 */
const connectDB = async () => {
  try {
    logger.db("Connecting to MongoDB...");
    const connectionInstance = await mongoose.connect(env.MONGODB_URI);
    logger.db(
      `MongoDB connected successfully: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    logger.db(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
