import { ac, roles } from "../config/ac.js";

export const authorize = (resource, action) => (req, res, next) => {

  if(!req.user || !req.user.role){
    return res.status(401).json({ message: "Unauthorized" });
  }
  const rolePermissions = roles[req.user.role];
  if (!rolePermissions || !ac.can(rolePermissions, resource, action)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};