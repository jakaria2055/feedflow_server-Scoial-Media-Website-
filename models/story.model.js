import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    mediaUrl: { type: String, required: true },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      expires: 0,
    },
  },
  { timestamps: true },
);

const Story = mongoose.model("Story", storySchema);
export default Story;
