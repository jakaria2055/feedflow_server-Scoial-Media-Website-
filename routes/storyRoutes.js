import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/cloudinaryUpload.js";
import {
  addCommentStory,
  createStory,
  deleteStoryById,
  getAllStories,
  toggleLikeStory,
  viewStory,
} from "../controllers/stroyControllers.js";

const storyRouter = Router();

storyRouter.post(
  "/create",
  authMiddleware,
  uploadCloudinary.single("media"),
  createStory,
);
storyRouter.get("/all", authMiddleware, getAllStories);
storyRouter.get("/:id/view", authMiddleware, viewStory);
storyRouter.delete("/:id", authMiddleware, deleteStoryById);
storyRouter.put("/:id/like", authMiddleware, toggleLikeStory);
storyRouter.post("/:id/comment", authMiddleware, addCommentStory);

export default storyRouter;
