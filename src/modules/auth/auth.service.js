import jwt from "jsonwebtoken";
import User from "../users/user.model.js"; // Note: User model will be created in task 19
import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";

/**
 * @description Service to handle user registration logic.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} The registered user object (without password)
 */
const register = async (userData) => {
  const { name, email, password } = userData;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // 2. Create the new user (hashing is handled in User model pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Convert to object and remove sensitive data
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * @description Service to handle user login logic.
 * @param {Object} loginData - { email, password }
 * @returns {Promise<Object>} { user, token }
 */
const login = async (loginData) => {
  const { email, password } = loginData;

  // 1. Find user by email and select password field
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Check if the user account is active
  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated. Please contact support.");
  }

  // 3. Verify password (comparePassword is a model instance method)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 4. Generate JWT token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  // 5. Prepare user response
  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    token,
  };
};

export { register, login };
