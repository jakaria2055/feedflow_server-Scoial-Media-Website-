import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Personal Info
    fullname: { type: String },
    status: { type: String, enum: ["single", "married", "divorce", "widow"]},
    gender: { type: String, enum: ["male", "female", "others"]},
    education: { type: String },
    job: { type: String },
    website: { type: String },

    // Additional attributes
    phone: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },

    // Social connections
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Content references
    savedPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
    story: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
