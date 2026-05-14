import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./services/mongo.service.js";
import contactRoutes from "./routes/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// 1. GLOBAL CORS - Apply this FIRST before any other middleware or routes
app.use(cors({
  origin: true, // Echoes back the requesting origin (Safe for credentials)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight for ALL routes explicitly
app.options('*', cors());

app.use(express.json());

// Logging for debugging (will show in Render logs)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// Health check and root routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio backend is live" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", contactRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // Ensure CORS headers are even on error responses
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Backend URL: ${BACKEND_URL}`);
  
  // Connect to DB in the background
  connectDB()
    .then(() => console.log("✓ MongoDB connected successfully"))
    .catch((err) => {
      console.error("⚠️ MongoDB connection failed:", err.message);
    });
});

// Self-ping to keep Render instance alive (every 10 minutes)
setInterval(() => {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => console.log("Self-ping successful:", data.status))
    .catch((err) => console.log("Self-ping failed:", err.message));
}, 10 * 60 * 1000);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});
