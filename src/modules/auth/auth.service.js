import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";

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

    // Save refresh token to database
    user.refreshToken = refreshToken;
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

    if (incomingRefreshToken !== user?.refreshToken) {
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

export { register, login, refreshAccessToken, logout };
