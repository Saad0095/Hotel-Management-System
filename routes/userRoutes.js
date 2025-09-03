import { Router } from "express";
import {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
} from "../controllers/userController.js";
import { authenticateUser, authRole } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validation/uservalidate.js";

const router = Router();


router.post("/register", validate(registerSchema), register);
router.post("/admin/register", authenticateUser, authRole(["admin","receptionist"]), register);
router.post("/login", validate(loginSchema), login);


router.get("/profile/me", authenticateUser, getUserProfile);

router.get("/", authenticateUser, authRole(["admin"]), getAllUsers);
router.get("/:id", authenticateUser, authRole(["admin"]), getUserById);
router.put("/:id", authenticateUser, authRole(["admin"]), updateUser);
router.delete("/:id", authenticateUser, authRole(["admin"]), deleteUser);

export default router;
