import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getPopularServices
} from "../controllers/serviceController.js";
import { authenticateUser, authRole } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { serviceSchema } from "../validation/serviceValidation.js";

const router = Router();

router.get("/", getAllServices);
router.get("/popular", getPopularServices);
router.get("/:id", getServiceById);

router.post("/", authenticateUser, authRole(["admin"]), validate(serviceSchema), createService);
router.put("/:id", authenticateUser, authRole(["admin"]), updateService);
router.delete("/:id", authenticateUser, authRole(["admin"]), deleteService);

export default router;
