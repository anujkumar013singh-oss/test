import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./services/mongo.service.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

console.log("✓ Loading routes...");
console.log("✓ Contact routes loaded:", typeof contactRoutes !== "undefined");

// ═══════════════════════════════════════════════════
// BUG 1 FIX: CORS with dynamic origin (no wildcard *)
// ═══════════════════════════════════════════════════
const allowedOrigins = [
  "http://localhost:5173", // Local Vite dev
  "http://localhost:3000", // Fallback local
  /^https:\/\/.*\.vercel\.app$/, // All Vercel preview & production URLs
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (allowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// ═══════════════════════════════════════════════════
// Health check route (used for self-ping)
// ═══════════════════════════════════════════════════
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

// Routes
console.log("✓ Mounting contact routes at /api...");
app.use("/api", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ═══════════════════════════════════════════════════
// BUG 2 FIX: Self-ping every 14 minutes to prevent cold start
// ═══════════════════════════════════════════════════
setInterval(() => {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => console.log("Self-ping successful:", data.status))
    .catch((err) => console.log("Self-ping failed:", err.message));
}, 14 * 60 * 1000); // 14 minutes

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    console.log("✓ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Backend URL: ${BACKEND_URL}`);
      console.log("✓ Routes registered:");
      console.log("  - GET  /api/health");
      console.log("  - POST /api/contact");
    });
  })
  .catch((err) => {
    console.error("⚠️ MongoDB connection failed, but starting server anyway:");
    console.error(err.message);
    console.log("⚠️ Server starting without database connection...");
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log("⚠️ Database operations will fail until MongoDB is connected");
      console.log("✓ Routes registered:");
      console.log("  - GET  /api/health");
      console.log("  - POST /api/contact");
    });
  });
