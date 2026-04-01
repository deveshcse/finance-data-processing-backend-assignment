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
  JWT_SECRET: z.string({
    required_error: "JWT_SECRET is required",
  }),
  JWT_EXPIRES_IN: z.string().default("7d"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Validate process.env against requested schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  process.exit(1);
}

/**
 * @description Validated and parsed environment variables.
 */
export const env = _env.data;
