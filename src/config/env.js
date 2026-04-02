import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

/**
 * @description Schema for environment variables validation using Zod.
 */
const envSchema = z.object({
  PORT: z
    .string()
    .default("5000")
    .transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string({
    required_error: "MONGODB_URI is required",
  }),
  JWT_ACCESS_SECRET: z.string({
    required_error: "JWT_ACCESS_SECRET is required",
  }),
  JWT_REFRESH_SECRET: z.string({
    required_error: "JWT_REFRESH_SECRET is required",
  }),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGINS: z.string().default("http://localhost:5000"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform(Number),
  RATE_LIMIT_MAX_GLOBAL: z.string().default("100").transform(Number),
  RATE_LIMIT_MAX_AUTH: z.string().default("20").transform(Number),
  BCRYPT_SALT_ROUNDS: z.string().default("12").transform(Number),
  API_VERSION: z.string().default("v1"),
  ACCESS_TOKEN_MAX_AGE: z.string().default("900000").transform(Number), // 15m
  REFRESH_TOKEN_MAX_AGE: z.string().default("604800000").transform(Number), // 7d
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  RESEND_API_KEY: z.string({
    required_error: "RESEND_API_KEY is required",
  }),
  EMAIL_FROM: z.string().default("onboarding@resend.dev"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

// Validate process.env against requested schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

/**
 * @description Validated and parsed environment variables.
 */
export const env = _env.data;
