import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

/**
 * @description Authentication middleware that verifies the JWT from the Authorization header.
 * Attaches the decoded user information ({ _id, role }) to req.user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is missing or invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // Attach user info to the request object
    req.user = {
      _id: decoded._id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired authentication token");
  }
});

export { authenticate };
