import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as userService from "./user.service.js";

/**
 * @description Controller to get all users.
 */
const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Users retrieved successfully."));
});

/**
 * @description Controller to get a user by ID.
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully."));
});

/**
 * @description Controller to update user details.
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully."));
});

/**
 * @description Controller to update user status (activate/deactivate).
 */
const updateUserStatus = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  const user = await userService.updateStatus(req.params.id, req.body.isActive);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User status updated successfully."));
});

/**
 * @description Controller to delete a user.
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  await userService.deleteUser(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully."));
});

export { getUsers, getUser, updateUser, updateUserStatus, deleteUser };
