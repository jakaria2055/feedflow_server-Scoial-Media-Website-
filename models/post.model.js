import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    mediaType: { type: String, enum: ["image", "video"], required: true }, 
    mediaUrl: { type: String, required: true },
    caption: { type: String, },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
export default Post;
