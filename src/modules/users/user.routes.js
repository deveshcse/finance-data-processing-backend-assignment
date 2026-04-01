import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  userParamsSchema,
  updateUserSchema,
  updateStatusSchema,
} from "./user.schema.js";
import * as userController from "./user.controller.js";

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin and Analyst only)
 */
router.get("/", authorize("users", "read"), userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID (Admin and Analyst only)
 */
router.get(
  "/:id",
  authorize("users", "read"),
  validate(userParamsSchema),
  userController.getUser
);

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user details (Admin only)
 */
router.patch(
  "/:id",
  authorize("users", "update"),
  validate(updateUserSchema),
  userController.updateUser
);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Deactivate or Activate user (Admin only)
 */
router.patch(
  "/:id/status",
  authorize("users", "change-status"),
  validate(updateStatusSchema),
  userController.updateUserStatus
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (Admin only)
 */
router.delete(
  "/:id",
  authorize("users", "delete"),
  validate(userParamsSchema),
  userController.deleteUser
);

export default router;
