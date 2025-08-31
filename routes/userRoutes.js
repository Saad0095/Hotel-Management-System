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

const router = Router();

router.post("/register", register);
router.post("/admin/register", authenticateUser, authRole("admin"), register);
router.post("/login", login);

router.get("/profile/me", authenticateUser, getUserProfile);

router.get("/", authenticateUser, authRole(["admin"]), getAllUsers);
router.get("/:id", authenticateUser, authRole(["admin"]), getUserById);
router.put("/:id", authenticateUser, authRole(["admin"]), updateUser);
router.delete("/:id", authenticateUser, authRole(["admin"]), deleteUser);


export default router;
