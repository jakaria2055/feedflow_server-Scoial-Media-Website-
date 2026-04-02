import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//Create Post
export const createPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    const userId = req.user._id;

    // Validate file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const mediaUrl = req.file.path;

    // Create new post
    const post = await Post.create({
      user: userId,
      mediaType,
      mediaUrl,
      caption,
    });

    const user = await User.findById(userId);
    if (user) {
      user?.posts.push(post?._id);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: error.message,
    });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
      error: error.message,
    });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    // If no post found
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching post",
      error: error.message,
    });
  }
};

// Delete Post By Id
export const deletePostById = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the logged-in user is the owner of the post
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting post",
      error: error.message,
    });
  }
};

// Toggle Like on Post
export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user already liked the post
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        likesCount: post.likes.length,
        likes: post.likes,
      });
    } else {
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        likesCount: post.likes.length,
        likes: post.likes,
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while toggling like",
      error: error.message,
    });
  }
};

// Add Comment to a Post
export const addCommentPost = async (req, res) => {
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

    // Find post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment object
    const comment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    // Push comment to post
    post.comments.push(comment);
    await post.save();

    // Re-fetch post with populated comments
    const updatedPost = await Post.findById(post._id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      commentsCount: updatedPost.comments.length,
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding comment",
      error: error.message,
    });
  }
};
