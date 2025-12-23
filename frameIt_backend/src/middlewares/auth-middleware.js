import { verifyAccessToken } from "../services/auth.service.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import User from "../models/user.model.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApiError(401, "access token not found, please login");
  }

  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "access token not found, please login");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, err.message || "token expired or invalid token");
  }

  const user = await User.findById(decoded._id).select("-password");
  if (!user) {
    throw new ApiError(401, "invalid access token");
  }

  req.user = user;
  next();
});

export default authMiddleware;
