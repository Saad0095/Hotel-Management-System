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
import validate from "../middlewares/validate.js";
import { createRoomSchema } from "../validation/roomvalidate.js";

const router = Router();

router.post("/", authenticateUser, authRole(["admin"]), validate(createRoomSchema), upload.array("images",10), createRoom);
router.put("/:id", authenticateUser, authRole(["admin"]), upload.array("images",10), updateRoom);
router.delete("/:id", authenticateUser, authRole(["admin"]), deleteRoom);

router.get("/", getAllRooms);
router.get("/:id/update", getRoomById);
router.get("/:id/status", getRoomStatus);

export default router;
