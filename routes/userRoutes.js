import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile
} from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Admin only routes
router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.get("/:id", authenticateToken, requireAdmin, getUserById);
router.put("/:id", authenticateToken, requireAdmin, updateUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

// User profile (authenticated users)
router.get("/profile/me", authenticateToken, getUserProfile);

export default router;
