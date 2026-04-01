import mongoose from "mongoose";

/**
 * @description Mongoose schema for the Transaction model.
 */
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type (income/expense) is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The user who created this transaction is required"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @description Indexes for frequently queried fields.
 */
transactionSchema.index({ createdBy: 1, date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
