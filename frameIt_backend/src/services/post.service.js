import Post from "../models/post.model.js";
import { uploadFile, deleteFile } from "./cloudinary.service.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import ApiError from "../utils/api-error.js";

const fetchAllPosts = async () => {
  const posts = await Post.find();
  return posts;
};

const fetchPostById = async (id) => {
  const post = await Post.findById(id).populate("author", "username");
  await post.populate("comments.author", "username");
  return post;
};

const fetchUserPosts = async (username) => {
  const user = await User.findOne({ username: username });
  if (!user) throw new ApiErrorError(404, "user not found");

  const { id } = user;
  const userPosts = await Post.find({ author: id });
  return userPosts;
};

const uploadPost = async (
  title,
  content,
  author,
  fileBuffer,
  folder = "mini_blog_api"
) => {
  try {
    const result = await uploadFile(fileBuffer, folder);
    const post = await Post.create({
      title,
      content,
      author,
      image: result.secure_url,
      public_id: result.public_id,
    });
    return post;
  } catch (err) {
    console.log("--- Error in uploadPost service ---", err.message);
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, "server error while uploading post");
  }
};

const removePost = async (id) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, "post not found");
    }
    const { public_id } = post;
    const result = await deleteFile(public_id);
    if (result.result !== "ok") {
      throw new ApiError(500, "cloudinary deletion failed");
    }

    await Post.findByIdAndDelete(post._id);

    return { success: true, message: "deletion successfull" };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.log("---- Error in deltePost service ----", err.message);
    throw new ApiError(500, "server error while deleting post");
  }
};

const getCommentService = async (postId) => {
  try {
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "invalid post id");
    }
    const post = await Post.findById(postId)
      .populate("comments.author", "username")
      .populate("author", "username");
    if (!post) throw new ApiError(404, "post not found");
    return post.comments;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.log("error in getCommentService: ", err.message);
  }
};

const toggleLikePostService = async (postId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(404, "post not found");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    let isLiked;
    if (post.likes.includes(userId)) {
      isLiked = true;
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      isLiked = false;
      post.likes.push(userId);
    }

    // save post
    await post.save();
    return {
      message: `post ${isLiked ? "unliked" : "liked"} successfully`,
      likes: post?.likes,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.log(`failed to like/unlike the post, Error: `, err.message);
    throw new ApiError(500, "server error while liking/unliking post");
  }
};

const addCommentService = async (postId, userId, content) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(404, "post not found");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "post not found");
    }

    const newComment = {
      author: userId,
      content: content,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    return {
      success: true,
      message: "post commented succssfully",
      comment: newComment,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.log("--- Failed to comment Error: ", err, " ----");
    throw new ApiError(500, "server error while commenting post");
  }
};

export {
  fetchAllPosts,
  fetchPostById,
  fetchUserPosts,
  getCommentService,
  uploadPost,
  removePost,
  toggleLikePostService,
  addCommentService,
};
