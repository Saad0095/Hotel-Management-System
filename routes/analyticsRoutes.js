
import { Router } from "express";
import {
  getDailyBookings,
  getMonthlyBookings,
  getOccupancyRate,
  getRevenueAnalytics
} from "../controllers/analyticsController.js";
import { authenticateUser, authRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateUser, authRole(["admin"]));

router.get("/daily-bookings", getDailyBookings);
router.get("/monthly-bookings", getMonthlyBookings);
router.get("/occupancy-rate", getOccupancyRate);
router.get("/revenue", getRevenueAnalytics);

export default router;