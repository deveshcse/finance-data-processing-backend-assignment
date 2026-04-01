import User from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * @description Retrieves all users from the database.
 * @returns {Promise<Array>} List of users excluding passwords
 */
const getAllUsers = async () => {
  return await User.find().select("-password").sort({ createdAt: -1 });
};

/**
 * @description Retrieves a single user by ID.
 * @param {string} id - User ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

/**
 * @description Updates user profile details (name, email, role).
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 */
const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

/**
 * @description Updates only the isActive status of a user.
 * @param {string} id - User ID
 * @param {boolean} isActive - New status
 */
const updateStatus = async (id, isActive) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { isActive } },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

/**
 * @description Deletes a user from the database.
 * @param {string} id - User ID
 */
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export { getAllUsers, getUserById, updateUser, updateStatus, deleteUser };
