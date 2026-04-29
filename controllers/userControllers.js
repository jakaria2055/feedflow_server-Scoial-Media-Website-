import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

//REGISTER USER
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(422).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const userData = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await userData.save();

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });

    // Cookie options
    const options = {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      secure: false, // change to true in production with HTTPS
      sameSite: "Strict",
    };

    // Exclude password from response
    const { password: pass, ...rest } = user._doc;

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "User registered successfully.",
      user: rest,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(422)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });

    // Cookie options
    const options = {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      secure: false, // set true in production with HTTPS
      sameSite: "Strict",
    };

    // Exclude password from response
    const { password: pass, ...rest } = user._doc;

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login successful.",
      user: rest,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

//LOGOUT
export const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Get profile of logged-in user
export const profileUser = async (req, res) => {
  try {
    const user = req.user; // req.user should be set by JWT middleware
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Get all users (admin use case)
export const allUser = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password field
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    // multer-storage-cloudinary already uploads file to cloudinary
    const profileImage = req.file?.path;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

// Get User By Id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "user", select: "username profileImage" },
          { path: "comments.user", select: "username profileImage" },
        ],
      })
      .populate({
        path: "reels",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "user", select: "username profileImage" },
          { path: "comments.user", select: "username profileImage" },
        ],
      })
      .populate({
        path: "savedPosts",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "user", select: "username profileImage" },
          { path: "comments.user", select: "username profileImage" },
        ],
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
      posts: user.posts,
      reels: user.reels,
      savedPosts: user.savedPosts, // ✅ fixed naming
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching user",
      error: error.message,
    });
  }
};

// Follow User
export const followUser = async (req, res) => {
  try {

    const userId = req.user?._id; // who follows
    const { targetId } = req.body; // whom to follow

      // Add this guard
    if (!targetId) {
      return res.status(400).json({ success: false, message: "targetId is required" });
    }

    if (userId.toString() === targetId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // Add to following/followers if not already present
    if (!user.following.includes(targetId)) {
      user.following.push(targetId);
    }
    if (!targetUser.followers.includes(userId)) {
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    //Socket Notification for follow
    const follower = await User.findById(userId).select(
      "username profileImage",
    );

    const receiverSocketId = getReceiverSocketId(targetId);
    //Follow notification
    if (receiverSocketId) {
      const notification = {
        type: "follow",
        userId: userId,
        targetUserId: targetId,
        userDetails: follower,
        message: `${follower.username} starting follow you`,
        createdAt: new Date(),
      };
      io.to(receiverSocketId).emit("notification", notification);
    }

    // Return updated lists
    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      following: user.following,
      followers: targetUser.followers,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while following user",
      error: error.message,
    });
  }
};

// Unfollow User
export const unFollowUser = async (req, res) => {
  try {
    const userId = req.user?._id; // who unfollows
    const { targetId } = req.body; // whom to unfollow

    if (userId.toString() === targetId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // Remove targetId from user's following list
    user.following = user.following.filter(
      (id) => id.toString() !== targetId.toString(),
    );

    // Remove userId from targetUser's followers list
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId.toString(),
    );

    await user.save();
    await targetUser.save();

    //Socket Notification for unfollow
    const unfollower = await User.findById(userId).select(
      "username profileImage",
    );

    const receiverSocketId = getReceiverSocketId(targetId);
    //unFollow notification
    if (receiverSocketId) {
      const notification = {
        type: "unfollow",
        userId: userId,
        targetUserId: targetId,
        userDetails: unfollower,
        message: `${unfollower.username} unfollow you`,
        createdAt: new Date(),
      };
      io.to(receiverSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      following: user.following,
      followers: targetUser.followers,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while unfollowing user",
      error: error.message,
    });
  }
};

// Get Followers of a User
export const getFollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("followers");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Followers fetched successfully",
      followers: user.followers,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching followers",
      error: error.message,
    });
  }
};

// Get Following of a User
export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate(
      "following",
      "username profileImage",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Following list fetched successfully",
      following: user.following,
    });
  } catch (error) {
    console.error("Error fetching following list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching following list",
      error: error.message,
    });
  }
};

//get Suggested User
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id;
    const excludeIds = [currentUserId, ...(req.user?.following || [])];

    const suggestedUsers = await User.find({
      _id: { $nin: excludeIds },
    })
      .select("username profileImage")
      .limit(20);

    res.status(200).json({
      success: true,
      message: "Suggested users fetched successfully",
      users: suggestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch suggested users",
    });
  }
};

// Update User Profile Info
export const updateProfileData = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedFields = [
      "username",
      "email",
      "fullname",
      "phone",
      "bio",
      "status",
      "gender",
      "education",
      "job",
      "website",
    ];

    const updateData = {};

    // pick only allowed fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // ✅ Enum validation
    if (
      updateData.status &&
      !["single", "married", "divorce", "widow"].includes(updateData.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    if (
      updateData.gender &&
      !["male", "female", "others"].includes(updateData.gender)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender value",
      });
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
