import { z } from "zod";

/**
 * @description Zod schema for user registration validation.
 */
const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format")
      .max(128, "Email cannot exceed 128 characters"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

/**
 * @description Zod schema for user login validation.
 */
const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

/**
 * @description Schema for refreshing access token.
 * Supports token extraction from both HttpOnly cookies (recommended) or request body.
 */
const refreshTokenSchema = z
  .object({
    cookies: z
      .object({
        refreshToken: z.string().optional(),
      })
      .optional(),
    body: z
      .object({
        refreshToken: z.string().optional(),
      })
      .optional(),
  })
  .refine((data) => data.cookies?.refreshToken || data.body?.refreshToken, {
    message: "Refresh token is required (either in cookies or body)",
  });

/**
 * @description Zod schema for the Forgot Password request.
 */
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format"),
  }),
});

/**
 * @description Zod schema for the Reset Password request.
 */
const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string({ required_error: "Reset token is required" }),
  }),
  body: z.object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
