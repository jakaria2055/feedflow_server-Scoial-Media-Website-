import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/cloudinaryUpload.js";
import {
  getAllUsersForMessage,
  getMessage,
  sendMessage,
} from "../controllers/messageControllers.js";

const messageRouter = Router();

messageRouter.get("/users", authMiddleware, getAllUsersForMessage);
messageRouter.get("/:id", authMiddleware, getMessage);
messageRouter.post(
  "/send/:receiverId",
  authMiddleware,
  uploadCloudinary.single("media"),
  sendMessage,
);

export default messageRouter;
