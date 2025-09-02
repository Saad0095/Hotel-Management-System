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
const express = require("express");
const userController = require("../controllers/userController");
const { registerSchema, loginSchema } = require("../validations/userValidation");
const validate = require("../middlewares/validate");


router.post("/register", register);
router.post("/admin/register", authenticateUser, authRole(["admin","receptionist"]), register);
router.post("/login", login);
router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);


router.get("/profile/me", authenticateUser, getUserProfile);

router.get("/", authenticateUser, authRole(["admin"]), getAllUsers);
router.get("/:id", authenticateUser, authRole(["admin"]), getUserById);
router.put("/:id", authenticateUser, authRole(["admin"]), updateUser);
router.delete("/:id", authenticateUser, authRole(["admin"]), deleteUser);


module.exports = router;

export default router;
