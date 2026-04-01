/**
 * @description ANSI color codes for terminal logging.
 */
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

/**
 * @description Helper to get current timestamp in ISO format.
 * @returns {string} ISO timestamp
 */
const timestamp = () => new Date().toISOString();

/**
 * @description Custom colorized logger utility for better observability.
 */
export const logger = {
  info: (msg) =>
    console.log(`${colors.cyan}[INFO]${colors.reset} ${timestamp()} - ${msg}`),
  success: (msg) =>
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${timestamp()} - ${msg}`
    ),
  warn: (msg) =>
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${timestamp()} - ${msg}`
    ),
  error: (msg, err) =>
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${timestamp()} - ${msg}`,
      err || ""
    ),
  db: (msg) =>
    console.log(
      `${colors.magenta}[DB]${colors.reset} ${timestamp()} - ${msg}`
    ),
};
