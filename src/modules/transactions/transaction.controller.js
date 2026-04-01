import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as transactionService from "./transaction.service.js";

/**
 * @description Controller to create a new transaction.
 */
const createTransaction = asyncHandler(async (req, res) => {
  // Use req.user._id attached by authenticate middleware
  const transaction = await transactionService.createTransaction(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, transaction, "Transaction created successfully."));
});

/**
 * @description Controller to get transactions based on filters.
 */
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getTransactions(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions retrieved successfully."));
});

/**
 * @description Controller to get a specific transaction by ID.
 */
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, transaction, "Transaction retrieved successfully."));
});

/**
 * @description Controller to update an existing transaction.
 */
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, transaction, "Transaction updated successfully."));
});

/**
 * @description Controller to delete a transaction.
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  await transactionService.deleteTransaction(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Transaction deleted successfully."));
});

export {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
