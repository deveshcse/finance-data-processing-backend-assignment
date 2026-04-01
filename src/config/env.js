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
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
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
