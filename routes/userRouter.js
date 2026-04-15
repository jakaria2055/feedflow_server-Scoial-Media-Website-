import { Router } from "express";
import {
  allUser,
  followUser,
  getFollowing,
  getFollowUser,
  getSuggestedUsers,
  getUserById,
  loginUser,
  logoutUser,
  profileUser,
  registerUser,
  unFollowUser,
  updateProfileData,
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
userRouter.put("/update-profile", authMiddleware, updateProfileData);
userRouter.get("/all", allUser);

//Follow Routes
userRouter.get("/:id", authMiddleware, getUserById);
userRouter.post("/follow", authMiddleware, followUser);
userRouter.post("/unfollow", authMiddleware, unFollowUser);
userRouter.get("/:id/followers", authMiddleware, getFollowUser);
userRouter.get("/:id/following", authMiddleware, getFollowing);

//Suggested User
userRouter.get("/suggested/users", authMiddleware, getSuggestedUsers);

export default userRouter;
