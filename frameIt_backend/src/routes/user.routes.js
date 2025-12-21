import { Router } from "express";
import {
  getAllUsers,
  getUserByUsername,
  followUser,
  unFollowUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:username", getUserByUsername);
router.post("/follow/:id", authMiddleware, followUser);
router.delete("/unfollow/:id", authMiddleware, unFollowUser);

export default router;
