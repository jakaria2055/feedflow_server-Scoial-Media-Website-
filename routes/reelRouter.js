import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/cloudinaryUpload.js";
import {
  addCommentReel,
  createReel,
  deleteReelById,
  getAllReels,
  getReelById,
  toggleLikeReel,
} from "../controllers/reelControllers.js";

const reelRouter = Router();

reelRouter.post(
  "/create",
  authMiddleware,
  uploadCloudinary.single("media"),
  createReel,
);
reelRouter.get("/all", authMiddleware, getAllReels);
reelRouter.get("/:id", authMiddleware, getReelById);
reelRouter.delete("/:id", authMiddleware, deleteReelById);
reelRouter.put("/:id/like", authMiddleware, toggleLikeReel);
reelRouter.post("/:id/comment", authMiddleware, addCommentReel);

export default reelRouter;
