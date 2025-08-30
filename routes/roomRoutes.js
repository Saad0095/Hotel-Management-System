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

const router = Router();

router.post("/", upload.array("images",10), createRoom);
router.get("/", getAllRooms);
router.get("/:id/update", getRoomById);
router.get("/:id/status", getRoomStatus);
router.put("/:id", upload.array("images",10), updateRoom);
router.delete("/:id", deleteRoom);

export default router;
