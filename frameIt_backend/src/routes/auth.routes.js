import { Router } from "express";
import { authRateLimiter } from "../utils/rate-limiter.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  refresh,
  checkAuth,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, checkAuth);

export default router;
