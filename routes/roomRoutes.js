import { Router } from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  getRoomStatus,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { authenticateUser, authRole } from "../middlewares/authMiddleware.js";

const router = Router();
const express = require("express");
const roomController = require("../controllers/roomController");
const { createRoomSchema } = require("../validations/roomValidation");
const validate = require("../middlewares/validate");

router.post("/", validate(createRoomSchema), roomController.createRoom);
router.post("/", authenticateUser, authRole(["admin"]), upload.array("images",10), createRoom);
router.put("/:id", authenticateUser, authRole(["admin"]), upload.array("images",10), updateRoom);
router.delete("/:id", authenticateUser, authRole(["admin"]), deleteRoom);

router.get("/", getAllRooms);
router.get("/:id/update", getRoomById);
router.get("/:id/status", getRoomStatus);

module.exports = router;
export default router;
