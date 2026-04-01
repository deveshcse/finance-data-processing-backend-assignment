import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as authService from "./auth.service.js";
import { env } from "../../config/env.js";

const cookieOptions = (maxAge = null) => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  ...(maxAge && { maxAge }),
});


/**
 * @description Controller for user registration.
 * Returns tokens in cookies and the user/accessToken in the body.
 */
const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions(env.ACCESS_TOKEN_MAX_AGE))
    .cookie("refreshToken", refreshToken, cookieOptions(env.REFRESH_TOKEN_MAX_AGE))
    .json(
      new ApiResponse(
        201,
        { user, accessToken },
        "User registered successfully."
      )
    );
});

/**
 * @description Controller for user login.
 */
const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions(env.ACCESS_TOKEN_MAX_AGE))
    .cookie("refreshToken", refreshToken, cookieOptions(env.REFRESH_TOKEN_MAX_AGE))
    .json(
      new ApiResponse(
        200,
        { user, accessToken },
        "Login successful."
      )
    );
});

/**
 * @description Controller to logout the user and clear cookies/DB tokens.
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions())
    .clearCookie("refreshToken", cookieOptions())
    .json(new ApiResponse(200, null, "Logged out successfully."));
});

/**
 * @description Controller to refresh access token using a valid refresh token.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(incomingRefreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions(env.ACCESS_TOKEN_MAX_AGE))
    .cookie("refreshToken", newRefreshToken, cookieOptions(env.REFRESH_TOKEN_MAX_AGE))
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully."
      )
    );
});

export { register, login, logout, refreshAccessToken };
