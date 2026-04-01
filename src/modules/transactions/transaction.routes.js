import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  transactionParamsSchema,
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from "./transaction.schema.js";
import * as transactionController from "./transaction.controller.js";

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction (Admin only)
 */
router.post(
  "/",
  authorize("transactions", "create"),
  validate(createTransactionSchema),
  transactionController.createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    Get transactions with optional filters (Admin, Analyst, Viewer)
 */
router.get(
  "/",
  authorize("transactions", "read"),
  validate(transactionQuerySchema),
  transactionController.getTransactions
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a specific transaction by ID (Admin, Analyst, Viewer)
 */
router.get(
  "/:id",
  authorize("transactions", "read"),
  validate(transactionParamsSchema),
  transactionController.getTransaction
);

/**
 * @route   PATCH /api/transactions/:id
 * @desc    Update a transaction (Admin only)
 */
router.patch(
  "/:id",
  authorize("transactions", "update"),
  validate(updateTransactionSchema),
  transactionController.updateTransaction
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction (Admin only)
 */
router.delete(
  "/:id",
  authorize("transactions", "delete"),
  validate(transactionParamsSchema),
  transactionController.deleteTransaction
);

export default router;
