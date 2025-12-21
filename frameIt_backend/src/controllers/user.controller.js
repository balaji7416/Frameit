import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import {
  fetchAllUsers,
  fetchUserByUsername,
  followUserService,
  unFollowUserService,
} from "../services/user.service.js";
import User from "../models/user.model.js";

// function to get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await fetchAllUsers();
  if (!users) {
    return res.status(404).json(new ApiResponse(404, "no users found", null));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "users fetched successfully", users));
});

//get user by username
const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await fetchUserByUsername(username);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res.status(200).json(new ApiResponse(200, "user found", user));
});

//follow user
const followUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostId = req.user._id;
  const result = await followUserService(id, hostId);
  res.status(200).json(new ApiResponse(200, result.message, result));
});

//unfollow user
const unFollowUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostId = req.user._id;
  const result = await unFollowUserService(id, hostId);
  res.status(200).json(new ApiResponse(200, result.message, result));
});

export { getAllUsers, getUserByUsername, followUser, unFollowUser };
