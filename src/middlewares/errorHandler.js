import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

/**
 * @description Global error handling middleware.
 * Catches all errors passed to next() and returns a standardized response.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. If it's not already an ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // 2. Prepare the response structure
  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    errors: error.errors,
    // Include stack trace only in development mode
    ...(env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  // 3. Log the error for server-side debugging
  if (env.NODE_ENV === "development") {
    console.error(`[Error] ${req.method} ${req.url}:`, error);
  }

  // 4. Send the standardized JSON response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };
