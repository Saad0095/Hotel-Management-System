import { Router } from "express";
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  updateBooking, 
  deleteBooking,
  checkIn,
  checkOut
} from "../controllers/bookingController.js";
import { authenticateToken, requireAdmin, requireCustomer } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (for viewing available rooms)
router.get("/", getAllBookings);

// Customer routes
router.post("/", authenticateToken, requireCustomer, createBooking);
router.get("/:id", getBookingById);

// Admin only routes
router.put("/:id", authenticateToken, requireAdmin, updateBooking);
router.delete("/:id", authenticateToken, requireAdmin, deleteBooking);
router.post("/:id/checkin", authenticateToken, requireAdmin, checkIn);
router.post("/:id/checkout", authenticateToken, requireAdmin, checkOut);

export default router;
