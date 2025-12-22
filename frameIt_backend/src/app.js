import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import authRouter from "./routes/auth.routes.js";

import { globalRateLimiter } from "./utils/rate-limiter.js";
import globalErrorHandler from "./middlewares/global-error-middleware.js";

import ApiResponse from "./utils/api-response.js";
import ApiError from "./utils/api-error.js";

const app = express();

const allowedOrigins = [
  "https://frameitfrontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:10000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman etc
      if (allowedOrigins.includes(origin)) {
        callback(null, origin); // <— MUST return the origin string, not `true`
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(globalRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  throw new ApiError(404, "Route not found");
});
app.use(globalErrorHandler);

export default app;
