import { Router } from "express";
import {
  allUser,
  loginUser,
  logoutUser,
  profileUser,
  registerUser,
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

export default userRouter;
