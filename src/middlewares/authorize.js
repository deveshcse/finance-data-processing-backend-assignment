import { ac, roles } from "../config/ac.js";

export const authorize = (resource, action) => (req, res, next) => {
  const rolePermissions = roles[req.user.role];
  if (!rolePermissions || !ac.can(rolePermissions, resource, action)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};