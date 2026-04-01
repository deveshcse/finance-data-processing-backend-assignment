import express from "express";
import cors from "cors";
import { rateLimiter } from "./middlewares/rate-limiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Route imports
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import transactionRoutes from "./modules/transactions/transaction.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

/**
 * @description Global Middlewares
 */
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
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

/**
 * @description Health check endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

/**
 * @description Global Error Handling Middleware (must be last)
 */
app.use(errorHandler);

export { app };
