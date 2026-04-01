import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middlewares/rate-limiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Route imports
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import transactionRoutes from "./modules/transactions/transaction.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

/**
 * @description Global Middlewares
 */
app.use(helmet()); // Set security HTTP headers first
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Swagger UI)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed`));
      }
    },
    credentials: true, // Required for cookies (refresh tokens)
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(rateLimiter);

/**
 * @description Swagger UI registration
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @description API route registrations
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    docs: "http://localhost:5000/api-docs",
  });
});

/**
 * @description 404 Route Catch-all (must be after all routes)
 */
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

/**
 * @description Global Error Handling Middleware (must be last)
 */
app.use(errorHandler);

export { app };
