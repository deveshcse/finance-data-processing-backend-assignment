import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

/**
 * @description All dashboard routes require authentication and "read" permission.
 */
router.use(authenticate, authorize("dashboard", "read"));

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get total income, expense, and net balance
 */
router.get("/summary", dashboardController.getSummary);

/**
 * @route   GET /api/dashboard/categories
 * @desc    Get category-wise transaction totals
 */
router.get("/categories", dashboardController.getCategoryStats);

/**
 * @route   GET /api/dashboard/trends
 * @desc    Get monthly income and expense trends
 */
router.get("/trends", dashboardController.getTrends);

/**
 * @route   GET /api/dashboard/recent
 * @desc    Get the 10 most recent transactions
 */
router.get("/recent", dashboardController.getRecentTransactions);

export default router;
