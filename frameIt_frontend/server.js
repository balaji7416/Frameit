import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// IMPORTANT: Proxy middleware must come BEFORE static files
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://frameit-jnsz.onrender.com",
    changeOrigin: true,
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
      // Log proxied requests for debugging
      console.log(`Proxying: ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({ error: "Proxy error" });
    },
  })
);

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, "dist")));

// Handle all routes - send index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `📡 Proxying /api requests to: https://frameit-jnsz.onrender.com`
  );
});
