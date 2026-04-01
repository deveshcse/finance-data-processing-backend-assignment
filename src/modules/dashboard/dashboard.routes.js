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
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved successfully
 */
router.get("/summary", dashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get category-wise totals
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category stats retrieved successfully
 */
router.get("/categories", dashboardController.getCategoryStats);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends retrieved successfully
 */
router.get("/trends", dashboardController.getTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent transactions retrieved successfully
 */
router.get("/recent", dashboardController.getRecentTransactions);

export default router;
