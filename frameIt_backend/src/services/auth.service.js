import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

const generateAccessToken = (_id, rememberMe) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "7d" : "1d",
  });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "access token expired");
    }
    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "invalid access token");
    }
    throw err;
  }
};

const registerUserService = async (username, email, password, rememberMe) => {
  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "user already exists");

    // create user
    const user = await User.create({ username, email, password });
    //generate refresh,access tokens
    const refreshToken = generateRefreshToken();
    const accessToken = generateAccessToken(user._id, rememberMe);

    //store refresh token hash in DB
    // const tokenHash = await bcrypt.hash(refreshToken, 10);
    // const tokenIdHash = crypto
    //   .createHash("sha256")
    //   .update(refreshToken)
    //   .digest("hex");

    // const token = {
    //   tokenHash,
    //   tokenIdHash,
    //   createdAt: new Date(),
    //   expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    // };
    // user.refreshTokens.push(token);
    // await user.save();

    // return refresh and access tokens to controller
    return { accessToken, refreshToken, user };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, "server error while registering");
  }
};

const loginUserService = async (email, password, rememberMe) => {
  try {
    // find the user from database
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(404, "user not found");

    // check password
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      throw new ApiError(401, "invalid password");
    }

    //generate refresh,access tokens
    const refreshToken = generateRefreshToken();
    const accessToken = generateAccessToken(user._id, rememberMe);

    //store refresh token hash in DB
    // const tokenHash = await bcrypt.hash(refreshToken, 10);
    // const tokenIdHash = crypto
    //   .createHash("sha256")
    //   .update(refreshToken)
    //   .digest("hex");

    // const token = {
    //   tokenHash,
    //   tokenIdHash,
    //   createdAt: new Date(),
    //   expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    // };
    // user.refreshTokens.push(token);
    // await user.save();

    // return refresh and access tokens to controller
    return { accessToken, refreshToken, user };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, "server error while login");
  }
};

const refreshTokenService = async (refreshToken) => {
  try {
    // hash refresh token and find user with that token hash

    const tokenIdHash = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const user = await User.findOne({
      "refreshTokens.tokenIdHash": tokenIdHash,
    });

    // if user not found throw error
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    const matchedToken = user.refreshTokens.find((t) =>
      bcrypt.compareSync(refreshToken, t.tokenHash)
    );

    if (!matchedToken) {
      throw new ApiError(401, "invalid refresh token");
    }

    // check expiry of refresh token
    if (matchedToken.expiresAt < new Date()) {
      throw new ApiError(401, "refresh token expired");
    }

    //romove old refresh token from DB
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== matchedToken
    );
    await user.save();

    //generate new access and refresh tokens(for rotation)
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken();

    //store new refresh token has in DB
    // const newTokenHash = await bcrypt.hash(newRefreshToken, 10);
    // const newTokenIdHash = crypto
    //   .createHash("sha256")
    //   .update(newRefreshToken)
    //   .digest("hex");
    // const newToken = {
    //   tokenHash: newTokenHash,
    //   tokenIdHash: newTokenIdHash,
    //   createdAt: new Date(),
    //   expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    // };
    // user.refreshTokens.push(newToken);
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, "server error while refreshing token");
  }
};

const logOutUserService = async (refreshToken) => {
  try {
    const tokenIdHash = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const user = await User.findOne({
      "refreshTokens.tokenIdHash": tokenIdHash,
    });
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    const matchedToken = user.refreshTokens.find(
      (t) => t.tokenIdHash === tokenIdHash
    );

    if (!matchedToken) {
      throw new ApiError(401, "invalid refresh token");
    }

    // remove current refresh token frm DB
    user.refreshTokens = user.refreshTokens.filter((t) => t !== matchedToken);
    await user.save();

    return {};
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, "server error while logging out user");
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  registerUserService,
  loginUserService,
  refreshTokenService,
  logOutUserService,
};
