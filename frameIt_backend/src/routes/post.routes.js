import { Router } from "express";

import upload from "../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  toggleLikePost,
  addComment,
  getPostById,
  getComments,
  getSearchResults,
} from "../controllers/post.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/user/:username", authMiddleware, getUserPosts);
router.get("/comments/:id", authMiddleware, getComments);
router.get("/id/:id", authMiddleware, getPostById);
router.post("/", authMiddleware, upload.single("image"), createPost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/toggle-like/:id", authMiddleware, toggleLikePost);
router.post("/comment/:id", authMiddleware, addComment);
router.get("/search", getSearchResults);
export default router;
