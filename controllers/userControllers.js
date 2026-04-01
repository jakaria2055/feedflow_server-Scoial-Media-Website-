import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

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
    return res.status(500).json({ success: false, message: "Internal server error." });
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
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileImage = req.file?.path;

    // Check if file exists
    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(profileImage, {
      folder: "profile_images",
    });

    // Update user profile with Cloudinary URL
    const updateUserProfile = await User.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      user: updateUserProfile,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

