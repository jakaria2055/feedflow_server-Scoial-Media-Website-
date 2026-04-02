import Reel from "../models/reel.model.js";
import User from "../models/user.model.js";

// Create Reel
export const createReel = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user._id;

    // Validate file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const mediaUrl = req.file.path;

    // Create new reel
    const reel = await Reel.create({
      user: userId,
      mediaUrl,
      caption,
    });

    const user = await User.findById(userId);
    if (user) {
      user?.reels.push(reel?._id);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Reel created successfully",
      reel,
    });
  } catch (error) {
    console.error("Error creating reel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating reel",
      error: error.message,
    });
  }
};

// Get all Reels
export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reels retrieved successfully",
      count: reels.length,
      reels,
    });
  } catch (error) {
    console.error("Error fetching reels:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reels",
      error: error.message,
    });
  }
};

// Get Reel by ID
export const getReelById = async (req, res) => {
  try {
    const reelId = req.params.id;

    const reel = await Reel.findById(reelId)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    // If no reel found
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reel retrieved successfully",
      reel,
    });
  } catch (error) {
    console.error("Error fetching reel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reel",
      error: error.message,
    });
  }
};

// Toggle Like on Reel
export const toggleLikeReel = async (req, res) => {
  try {
    const userId = req.user._id;
    const reel = await Reel.findById(req.params.id);

    // Check if reel exists
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    // Check if user already liked the reel
    const index = reel.likes.indexOf(userId);
    if (index === -1) {
      reel.likes.push(userId);
      await reel.save();
      return res.status(200).json({
        success: true,
        message: "Reel liked successfully",
        likesCount: reel.likes.length,
        likes: reel.likes,
      });
    } else {
      reel.likes.splice(index, 1);
      await reel.save();
      return res.status(200).json({
        success: true,
        message: "Reel unliked successfully",
        likesCount: reel.likes.length,
        likes: reel.likes,
      });
    }
  } catch (error) {
    console.error("Error toggling like on reel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while toggling like on reel",
      error: error.message,
    });
  }
};

// Add Comment to a Reel
export const addCommentReel = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;

    // Validate comment text
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Find reel
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    // Create comment object
    const comment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    // Push comment to reel
    reel.comments.push(comment);
    await reel.save();

    // Re-fetch reel with populated comments
    const updatedReel = await Reel.findById(reel._id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      commentsCount: updatedReel.comments.length,
      comments: updatedReel.comments,
    });
  } catch (error) {
    console.error("Error adding comment to reel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding comment to reel",
      error: error.message,
    });
  }
};

// Delete Reel By Id
export const deleteReelById = async (req, res) => {
  try {
    const userId = req.user._id;
    const reel = await Reel.findById(req.params.id);

    // Check if reel exists
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    // Check if the logged-in user is the owner of the reel
    if (reel.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete this reel",
      });
    }

    await reel.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Reel deleted successfully",
      reel,
    });
  } catch (error) {
    console.error("Error deleting reel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting reel",
      error: error.message,
    });
  }
};
