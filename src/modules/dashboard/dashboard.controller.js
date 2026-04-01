import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as dashboardService from "./dashboard.service.js";

/**
 * @description Controller to get summary (total income, total expenses, balance).
 */
const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary();

  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Summary retrieved successfully."));
});

/**
 * @description Controller to get totals by category.
 */
const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getCategoryStats();

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Category statistics retrieved successfully."));
});

/**
 * @description Controller to get monthly income/expense trends.
 */
const getTrends = asyncHandler(async (req, res) => {
  const trends = await dashboardService.getTrends();

  return res
    .status(200)
    .json(new ApiResponse(200, trends, "Trends retrieved successfully."));
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
