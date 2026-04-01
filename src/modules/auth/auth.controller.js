import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as authService from "./auth.service.js";

/**
 * @description Controller to handle user registration.
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully."));
});

/**
 * @description Controller to handle user login.
 */
const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Login successful."));
});

export { register, login };
