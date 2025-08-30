import { Router } from "express";
import {
  getDailyBookings,
  getMonthlyBookings,
  getOccupancyRate,
  getRevenueAnalytics
} from "../controllers/analyticsController.js";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// All analytics routes require admin access
router.use(authenticateToken, requireAdmin);

router.get("/daily-bookings", getDailyBookings);
router.get("/monthly-bookings", getMonthlyBookings);
router.get("/occupancy-rate", getOccupancyRate);
router.get("/revenue", getRevenueAnalytics);

export default router;
