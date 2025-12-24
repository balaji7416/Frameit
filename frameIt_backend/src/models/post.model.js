import mongoose, { mongo } from "mongoose";

const commentShema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timeStamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      // image secure_url from cloudinary
      type: String,
    },
    public_id: {
      // for deleting later from cloudinary
      type: String,
    },
    comments: [commentShema],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// indexing for text search
postSchema.index({ title: "text", content: "text" });

const Post = mongoose.model("Post", postSchema);

export default Post;
