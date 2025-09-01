import { Router } from "express";
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  updateBooking, 
  deleteBooking,
  checkIn,
  checkOut,
  cancelBooking
} from "../controllers/bookingController.js";
import { authenticateUser, authRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);

router.post("/", authenticateUser, authRole(["customer","receptionist","admin"]), createBooking);

router.put("/:id", authenticateUser, authRole(["admin","receptionist"]), updateBooking);
router.delete("/:id", authenticateUser, authRole(["admin","receptionist"]), deleteBooking);
router.patch("/:id/checkin", authenticateUser, authRole(["admin","receptionist"]), checkIn);
router.patch("/:id/checkout", authenticateUser, authRole(["admin","receptionist"]), checkOut);
router.patch("/:id/cancel", authenticateUser, authRole(["customer","admin","receptionist"]), cancelBooking);

export default router;
