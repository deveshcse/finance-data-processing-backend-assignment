import { z } from "zod";
import { objectIdSchema } from "../../utils/schemas.js";

/**
 * @description Schema for validating user ID in request parameters.
 */
const userParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * @description Schema for updating user details.
 */
const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      email: z.string().email("Invalid email format").optional(),
      role: z.enum(["viewer", "analyst", "admin"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field (name, email, or role) must be provided for update",
    }),
});

/**
 * @description Schema for updating user status (active/deactive).
 */
const updateStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    isActive: z.boolean({
      required_error: "isActive status (true/false) is required",
    }),
  }),
});

export { userParamsSchema, updateUserSchema, updateStatusSchema };
