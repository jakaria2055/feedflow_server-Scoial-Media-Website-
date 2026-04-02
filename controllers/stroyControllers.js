import Story from "../models/story.model.js";
import User from "../models/user.model.js";

// Create Story
export const createStory = async (req, res) => {
  try {
    const { mediaType } = req.body;
    const userId = req.user._id;

    // Validate file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const mediaUrl = req.file.path;

    // Create new story
    const story = await Story.create({
      user: userId,
      mediaType,
      mediaUrl,
    });

    const user = await User.findById(userId);
    if (user) {
      user?.story.push(story?._id);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating story",
      error: error.message,
    });
  }
};

// Get all Stories
export const getAllStories = async (req, res) => {
  try {
    const now = new Date(); // current time

    const stories = await Story.find({ expireAt: { $gt: now } })
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Stories retrieved successfully",
      count: stories.length,
      stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching stories",
      error: error.message,
    });
  }
};

// View Story
export const viewStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(id);

    // Check if story exists
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Add viewer if not already viewed
    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    return res.status(200).json({
      success: true,
      message: "Story viewed successfully",
      viewersCount: story.viewers.length,
      viewers: story.viewers,
    });
  } catch (error) {
    console.error("Error viewing story:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while viewing story",
      error: error.message,
    });
  }
};

// Toggle Like on Story
export const toggleLikeStory = async (req, res) => {
  try {
    const userId = req.user._id;
    const story = await Story.findById(req.params.id);

    // Check if story exists
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Check if user already liked the story
    const index = story.likes.indexOf(userId);
    if (index === -1) {
      story.likes.push(userId);
      await story.save();
      return res.status(200).json({
        success: true,
        message: "Story liked successfully",
        likesCount: story.likes.length,
        likes: story.likes,
      });
    } else {
      story.likes.splice(index, 1);
      await story.save();
      return res.status(200).json({
        success: true,
        message: "Story unliked successfully",
        likesCount: story.likes.length,
        likes: story.likes,
      });
    }
  } catch (error) {
    console.error("Error toggling like on story:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while toggling like on story",
      error: error.message,
    });
  }
};

// Add Comment to a Story
export const addCommentStory = async (req, res) => {
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

    // Find story
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Create comment object
    const comment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    // Push comment to story
    story.comments.push(comment);
    await story.save();

    // Re-fetch story with populated comments
    const updatedStory = await Story.findById(story._id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      commentsCount: updatedStory.comments.length,
      comments: updatedStory.comments,
    });
  } catch (error) {
    console.error("Error adding comment to story:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding comment to story",
      error: error.message,
    });
  }
};

// Delete Story By Id
export const deleteStoryById = async (req, res) => {
  try {
    const userId = req.user._id;
    const story = await Story.findById(req.params.id);

    // Check if story exists
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Check if the logged-in user is the owner of the story
    if (story.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete this story",
      });
    }

    await story.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
      story,
    });
  } catch (error) {
    console.error("Error deleting story:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting story",
      error: error.message,
    });
  }
};
