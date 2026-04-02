import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/cloudinaryUpload.js";
import {
  addCommentPost,
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  toggleLikePost,
} from "../controllers/postControllers.js";

const postRouter = Router();

postRouter.post(
  "/create",
  authMiddleware,
  uploadCloudinary.single("media"),
  createPost,
);
postRouter.get("/all",authMiddleware, getAllPosts);
postRouter.get("/:id", authMiddleware, getPostById);
postRouter.delete("/:id", authMiddleware, deletePostById);
postRouter.put("/:id/like", authMiddleware, toggleLikePost);
postRouter.post("/:id/comment", authMiddleware, addCommentPost);

export default postRouter;
