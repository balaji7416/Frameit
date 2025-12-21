import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import asyncHanlder from "../utils/async-handler.js";

const fetchAllUsers = async () => {
  const users = await User.find();
  return users;
};

const fetchUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

const followUserService = async (targetId, currentId) => {
  try {
    if (targetId == currentId) {
      throw new Error("you cannot follow yourself");
    }
    const targetUser = await User.findById(targetId);
    if (!targetUser) throw new Error("target user not found");

    const currentUser = await User.findById(currentId);
    if (!currentUser) throw new Error("current user not found");

    let isFollowing = true;
    if (!currentUser.following.includes(targetId)) {
      isFollowing = false;
      currentUser.following.push(targetId);
      targetUser.followers.push(currentId);
      await currentUser.save();
      await targetUser.save();
    }

    return {
      success: isFollowing ? false : true,
      message: isFollowing
        ? "you are already following the user"
        : "user followed successfully",
      followingCountOfCurrent: currentUser.following.length,
      followerCountOfTarget: targetUser.followers.length,
    };
  } catch (err) {
    console.log("Failed to follow user, Error: ", err);
    throw err;
  }
};

const unFollowUserService = async (targetId, currentId) => {
  try {
    if (targetId == currentId) {
      throw new Error("you cannot unfollow yourself");
    }
    const targetUser = await User.findById(targetId);
    if (!targetUser) throw new Error("target user not found");

    const currentUser = await User.findById(currentId);
    if (!currentUser) throw new Error("current user not found");

    let isFollowing = false;
    if (currentUser.following.includes(targetId)) {
      isFollowing = true;
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() != currentId.toString()
      );
      await currentUser.save();
      await targetUser.save();
    }
    return {
      success: isFollowing ? true : false,
      message: isFollowing
        ? "unfollwed user successfully"
        : "user is not followed",
      followingCountOfCurrent: currentUser.following.length,
      followerCountOfTarget: targetUser.followers.length,
    };
  } catch (err) {
    console.log("failed to unfollow the user, Error: ", err);
    throw err;
  }
};
export {
  fetchAllUsers,
  fetchUserByUsername,
  followUserService,
  unFollowUserService,
};
