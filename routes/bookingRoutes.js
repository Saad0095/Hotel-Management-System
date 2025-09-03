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
import validate from "../middlewares/validateMiddleware.js";
import { bookingSchema } from "../validation/bookingValidation.js";

const router = Router();

router.get("/", authenticateUser,getAllBookings);
router.get("/:id",authenticateUser, getBookingById);

router.post("/", authenticateUser, validate(bookingSchema), createBooking);

router.put("/:id", authenticateUser, updateBooking);
router.delete("/:id", authenticateUser, authRole(["admin","receptionist"]), deleteBooking);
router.patch("/:id/checkin", authenticateUser, authRole(["admin","receptionist"]), checkIn);
router.patch("/:id/checkout", authenticateUser, authRole(["admin","receptionist"]), checkOut);
router.patch("/:id/cancel", authenticateUser, cancelBooking);

export default router;
