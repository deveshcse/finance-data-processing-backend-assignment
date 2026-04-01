import { ApiError } from "../utils/ApiError.js";

/**
 * @description Middleware to validate incoming request data using Zod schemas.
 * It checks req.body, req.query, and req.params as defined in the provided schema.
 * @param {import("zod").ZodSchema} schema - The Zod schema to validate against.
 */
const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Replace request data with validated/transformed data
    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;

    next();
  } catch (error) {
    // If validation fails, extract error details and pass to error handler
    const errors = error.errors?.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    next(new ApiError(400, "Validation Error", errors));
  }
};

export { validate };
