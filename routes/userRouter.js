import { Router } from "express";
import {
  allUser,
  followUser,
  getFollowing,
  getFollowUser,
  loginUser,
  logoutUser,
  profileUser,
  registerUser,
  unFollowUser,
  uploadProfileImage,
} from "../controllers/userControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/cloudinaryUpload.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/profile", authMiddleware, profileUser);
userRouter.post(
  "/upload-profile",
  authMiddleware,
  uploadCloudinary.single("profileImage"),
  uploadProfileImage,
);
userRouter.get("/all", allUser);

//Follow Routes
userRouter.get("/:id", authMiddleware, getUserById);
userRouter.get("/:targetId/follow", authMiddleware, followUser);
userRouter.get("/:targetId/unfollow", authMiddleware, unFollowUser);
userRouter.get("/:id/followers", authMiddleware, getFollowUser);
userRouter.get("/:id/following", authMiddleware, getFollowing);

export default userRouter;
