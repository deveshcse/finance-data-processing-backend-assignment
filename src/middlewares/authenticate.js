import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import User from "../modules/users/user.model.js";

/**
 * @description Authentication middleware that verifies the JWT from the Authorization header.
 * Attaches the decoded user information ({ _id, role }) to req.user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Authentication failed: Missing or invalid Authorization header");
    throw new ApiError(401, "Authentication token is missing or invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // Verify the user still exists and is active in the database.
    // This closes the window where a deactivated user with a valid token
    // could still make requests for up to JWT_ACCESS_EXPIRES_IN.
    const dbUser = await User.findById(decoded._id).select("isActive role");
    if (!dbUser || !dbUser.isActive) {
      logger.warn(`Blocked request from deactivated/deleted user: ${decoded._id}`);
      throw new ApiError(401, "Account is deactivated or no longer exists.");
    }

    // Attach verified user info from DB to the request object
    req.user = {
      _id: decoded._id,
      role: dbUser.role, // Use role from DB, not token, in case it was updated
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired authentication token");
  }
});

export { authenticate };
