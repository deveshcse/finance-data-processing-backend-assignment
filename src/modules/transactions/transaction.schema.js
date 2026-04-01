import { z } from "zod";
import mongoose from "mongoose";

/**
 * @description Helper schema to validate MongoDB ObjectId.
 */
const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ID format",
});

/**
 * @description Schema for validating transaction ID in request parameters.
 */
const transactionParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * @description Schema for creating a new transaction.
 */
const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number({ required_error: "Amount is required" }).positive("Amount must be positive"),
    type: z.enum(["income", "expense"], { required_error: "Type is required" }),
    category: z.string({ required_error: "Category is required" }).trim().min(1),
    date: z
      .string({ required_error: "Date is required" })
      .datetime({ message: "Invalid date format, use ISO 8601" })
      .transform((val) => new Date(val)),
    notes: z.string().trim().optional(),
  }),
});

/**
 * @description Schema for updating an existing transaction.
 */
const updateTransactionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      amount: z.number().positive("Amount must be positive").optional(),
      type: z.enum(["income", "expense"]).optional(),
      category: z.string().trim().min(1).optional(),
      date: z
        .string()
        .datetime()
        .transform((val) => new Date(val))
        .optional(),
      notes: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

/**
 * @description Schema for filtering transactions via query parameters.
 */
const transactionQuerySchema = z.object({
  query: z.object({
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    startDate: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
    endDate: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().positive()),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .pipe(z.number().int().positive().max(100)),
  }),
});

export {
  transactionParamsSchema,
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
};
