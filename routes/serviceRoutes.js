import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getPopularServices
} from "../controllers/serviceController.js";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getAllServices);
router.get("/popular", getPopularServices);
router.get("/:id", getServiceById);

// Admin only routes
router.post("/", authenticateToken, requireAdmin, createService);
router.put("/:id", authenticateToken, requireAdmin, updateService);
router.delete("/:id", authenticateToken, requireAdmin, deleteService);

export default router;
