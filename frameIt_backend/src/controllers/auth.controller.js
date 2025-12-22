import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

import {
  registerUserService,
  loginUserService,
  refreshTokenService,
  logOutUserService,
} from "../services/auth.service.js";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, rememberMe } = req.body;

  if (!username) throw new ApiError(400, "username missing");
  if (!email) throw new ApiError(400, "email missing");
  if (!password) throw new ApiError(400, "password missing");

  const { user, accessToken, refreshToken } = await registerUserService(
    username,
    email,
    password
  );

  const refreshMaxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000 // 7 days
    : 24 * 60 * 60 * 1000; // 1 day (still persistent)

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: refreshMaxAge,
  });

  const sanitizedUser = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  res
    .status(201)
    .json(new ApiResponse(201, "user registration successfull", sanitizedUser));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email) {
    throw new ApiError(400, "email is missing");
  }
  if (!password) {
    throw new ApiError(400, "password is missing");
  }

  const { user, accessToken, refreshToken } = await loginUserService(
    email,
    password
  );

  const refreshMaxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000 // 7 days
    : 24 * 60 * 60 * 1000; // 1 day (still persistent)

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: refreshMaxAge,
  });

  const sanitizedUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  res
    .status(200)
    .json(new ApiResponse(200, "user login successfull", sanitizedUser));
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "refresh token not found, please login again");
  }
  await logOutUserService(refreshToken);

  res.clearCookie("refreshToken", {
    ...cookieOptions,
  });
  res.clearCookie("accessToken", {
    ...cookieOptions,
  });

  res.status(200).json(new ApiResponse(200, "logout successfull", null));
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "refresh token not found, please login again");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshTokenService(refreshToken);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 20 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "new access token generated", null));
});

const checkAuth = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "user is authenticated", req.user));
});
export { registerUser, loginUser, logoutUser, refresh, checkAuth };
