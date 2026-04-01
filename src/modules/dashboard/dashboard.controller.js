import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as dashboardService from "./dashboard.service.js";

/**
 * @description Controller to get summary (total income, total expenses, balance).
 */
const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Quick summary retrieved successfully."));
});

/**
 * @description Controller to get totals by category.
 */
const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getCategoryStats(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Category stats retrieved successfully."));
});

/**
 * @description Controller to get monthly income/expense trends.
 */
const getTrends = asyncHandler(async (req, res) => {
  const trends = await dashboardService.getTrends(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, trends, "Income and expense trends retrieved."));
});

/**
 * @description Controller to get the 10 most recent transactions.
 */
const getRecentTransactions = asyncHandler(async (req, res) => {
  const recent = await dashboardService.getRecentTransactions();

  return res
    .status(200)
    .json(new ApiResponse(200, recent, "Recent transactions retrieved successfully."));
});

export { getSummary, getCategoryStats, getTrends, getRecentTransactions };
