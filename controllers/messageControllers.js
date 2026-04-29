import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Send Message Controller
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user?._id;
    const { receiverId } = req.params;

    // Basic validation
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver IDs are required",
      });
    }

    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message must contain either text or media",
      });
    }

    let mediaType = null;
    let mediaUrl = null;

    if (req.file && req.file.path) {
      mediaUrl = req.file.path; // Cloudinary URL
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      mediaType,
      mediaUrl,
    });

    await newMessage.save();

    //Emit Message via web Socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get Message Controller
export const getMessage = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const { id: receiverId } = req.params;

    // Basic validation
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver IDs are required",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve messages",
      error: error.message,
    });
  }
};

// Get All Users for Messaging
export const getAllUsersForMessage = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    // Basic validation
    if (!loggedInUserId) {
      return res.status(400).json({
        success: false,
        message: "Logged-in user ID is required",
      });
    }

    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password") // exclude sensitive fields
      .sort({ createdAt: -1 }); // newest users first

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};
