import rateLimit from "express-rate-limit";

const globalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, try later",
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many authentication requests from this IP, try later",
});

export { globalRateLimiter, authRateLimiter };
