import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

import {
  fetchAllPosts,
  fetchUserPosts,
  uploadPost,
  getCommentService,
  removePost,
  toggleLikePostService,
  addCommentService,
  fetchPostById,
} from "../services/post.service.js";

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await fetchAllPosts();
  if (!posts) {
    return res.status(200).json(new ApiResponse(200, "no posts found", posts));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "posts fetched successfully", posts));
});

const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await fetchPostById(id);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, "post not found"));
  }
  return res.status(200).json(new ApiResponse(200, "post found", post));
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const posts = await fetchUserPosts(username);
  if (!posts) {
    return res.status(404).json(new ApiResponse(404, "no posts found", posts));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "user posts fetching successfull", posts));
});

const createPost = asyncHandler(async (req, res) => {
  const { content, title } = req.body;
  const file = req.file;

  if (!file) {
    throw new ApiError(404, "post Image not found");
  }

  const post = await uploadPost(title, content, req.user._id, file.buffer);

  return res
    .status(201)
    .json(new ApiResponse(201, "post uploading successfull", post));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await removePost(id);
  return res
    .status(200)
    .json(new ApiResponse(200, "post deletion successfull", result));
});

const toggleLikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  const result = await toggleLikePostService(id, user_id);
  return res
    .status(200)
    .json(new ApiResponse(200, result.message, result.likes));
});

const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "content is missing");
  }
  if (!userId) {
    throw new ApiError(400, "user id is missing");
  }
  if (!id) {
    throw new ApiError(400, "post id is missing");
  }

  const result = await addCommentService(id, userId, content);
  return res
    .status(201)
    .json(new ApiResponse(201, "commented post successfully", result));
});

const getComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comments = await getCommentService(id);

  if (!comments) {
    return res
      .status(404)
      .json(new ApiResponse(404, "no comments found", comments));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "comments fetched successfully", comments));
});

export {
  getAllPosts,
  getPostById,
  getComments,
  getUserPosts,
  createPost,
  deletePost,
  toggleLikePost,
  addComment,
};
