import { ac, roles } from "../config/ac.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * @description Authorization middleware that checks if the authenticated user
 * has the required permission (resource + action) based on their role.
 * Uses next(ApiError) to route through the global error handler for consistent responses.
 *
 * @param {string} resource - The resource being accessed (e.g. "users", "transactions")
 * @param {string} action - The action being performed (e.g. "read", "create", "delete")
 */
export const authorize = (resource, action) => (req, res, next) => {
  if (!req.user?.role) {
    return next(new ApiError(401, "Authentication required"));
  }

  const rolePermissions = roles[req.user.role];

  if (!rolePermissions || !ac.can(rolePermissions, resource, action)) {
    return next(
      new ApiError(
        403,
        `Forbidden: Your role (${req.user.role}) does not have '${action}' permission on '${resource}'`
      )
    );
  }

  next();
};