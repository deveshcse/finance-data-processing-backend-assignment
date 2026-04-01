import { app } from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

/**
 * @description Main server entry point.
 * Connects to the database first, then starts the Express server.
 */

// 1. Handle Uncaught Exceptions (Synchronous errors)
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION!: Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

// 2. Connect to Database and start Server
connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      logger.success(`Server is running on port: ${env.PORT}`);
      logger.info(`Health check: http://localhost:${env.PORT}/health`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed!: ", err);
    process.exit(1);
  });

// 3. Handle Unhandled Rejections (Asynchronous errors)
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION!: Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});
