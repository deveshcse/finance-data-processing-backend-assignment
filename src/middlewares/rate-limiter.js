import { rateLimit } from "express-rate-limit";

/**
 * @description Standard rate limiter to prevent brute-force attacks and abuse.
 * Limits each IP to 100 requests per 15-minute window.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    statusCode: 429,
    data: null,
  },
});

/**
 * @description Stricter rate limiter for sensitive authentication routes.
 * Limits each IP to 10 requests per 15-minute window.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/register attempts, please try again after 15 minutes.",
    statusCode: 429,
    data: null,
  },
});

export { rateLimiter, authRateLimiter };
