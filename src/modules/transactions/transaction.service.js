import Transaction from "./transaction.model.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * @description Creates a new transaction.
 * @param {Object} transactionData - Transaction details
 * @param {string} userId - ID of the user creating the transaction
 */
const createTransaction = async (transactionData, userId) => {
  return await Transaction.create({
    ...transactionData,
    createdBy: userId,
  });
};

/**
 * @description Retrieves transactions based on filters with pagination.
 * @param {Object} filters - Filter criteria (type, category, startDate, endDate, page, limit)
 */
const getTransactions = async (filters) => {
  const query = {};

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 20));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transaction.find(query)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * @description Retrieves a single transaction by its ID.
 * @param {string} id - Transaction ID
 */
const getTransactionById = async (id) => {
  const transaction = await Transaction.findById(id).populate("createdBy", "name email");
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  return transaction;
};

/**
 * @description Updates an existing transaction.
 * @param {string} id - Transaction ID
 * @param {Object} updateData - Data to update
 */
const updateTransaction = async (id, updateData) => {
  const transaction = await Transaction.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  return transaction;
};

/**
 * @description Deletes a transaction from the database.
 * @param {string} id - Transaction ID
 */
const deleteTransaction = async (id) => {
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  return transaction;
};

export {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
