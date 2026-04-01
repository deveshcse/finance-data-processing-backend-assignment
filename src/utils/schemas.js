import { z } from "zod";
import mongoose from "mongoose";

/**
 * @description Helper schema to validate MongoDB ObjectId.
 * Centralized here to avoid DRY violations across modules.
 */
export const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ID format",
});
