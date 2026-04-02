import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../users/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";
import { sendResetPasswordEmail } from "../../utils/email.service.js";

/**
 * @description Helper to produce a SHA-256 hash of a token.
 * Used to safely store and compare refresh tokens without exposing raw values.
 * @param {string} token
 * @returns {string} hex digest
 */
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * @description Helper to generate both Access and Refresh tokens.
 * @param {Object} user - User object
 * @returns {Promise<Object>} Object containing accessToken and refreshToken
 */
const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    // Store only the HASH of the refresh token — never the raw value
    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

/**
 * @description Register a new user and return tokens.
 */
const register = async (userData) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create(userData);
  const { accessToken, refreshToken } = await generateTokens(user);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: createdUser, accessToken, refreshToken };
};

/**
 * @description Authenticate user and return tokens.
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  // Deliberately use the same generic message to avoid user enumeration
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: loggedInUser, accessToken, refreshToken };
};

/**
 * @description Refresh the Access Token using a valid Refresh Token (implements rotation).
 */
const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Compare by hash — the DB stores a hash, never the raw token
    if (hashToken(incomingRefreshToken) !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

/**
 * @description Clear the refresh token from the database.
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1, // Remove field
      },
    },
    { new: true }
  );
};

/**
 * @description Send password reset email.
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Return a generic success to prevent user enumeration
    return { message: "If an account with that email exists, we have sent a password reset link." };
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendResetPasswordEmail(user.email, resetUrl);
    return { message: "If an account with that email exists, we have sent a password reset link." };
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Email could not be sent");
  }
};

/**
 * @description Reset password.
 */
const resetPassword = async (token, password) => {
  // Hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.refreshToken = undefined;

  await user.save();

  return { message: "Password reset success" };
};

export { register, login, refreshAccessToken, logout, forgotPassword, resetPassword };
