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

console.log("✓ Environment loaded. MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
console.log("✓ BREVO_API_KEY:", process.env.BREVO_API_KEY ? "SET" : "NOT SET");

const app = express();
const PORT = process.env.PORT || 3500;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// 1. Robust CORS configuration
const allowedOrigins = [
  "https://anujsingh-developer.vercel.app",
  "https://solodeveloper.in",
  "https://www.solodeveloper.in",
  "https://test-yu3u.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      /^https:\/\/.*\.vercel\.app$/.test(origin) ||
                      /^https:\/\/.*\.netlify\.app$/.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors());

app.use(express.json());

// Health check and root routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio backend is live" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

// API Routes
console.log("✓ Mounting contact routes at /api...");
app.use("/api", contactRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Backend URL: ${BACKEND_URL}`);
  
  // Connect to DB in the background to prevent startup timeouts
  connectDB()
    .then(() => console.log("✓ MongoDB connected successfully"))
    .catch((err) => {
      console.error("⚠️ MongoDB connection failed:", err.message);
    });
});

// Self-ping to keep Render instance alive
setInterval(() => {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => console.log("Self-ping successful:", data.status))
    .catch((err) => console.log("Self-ping failed:", err.message));
}, 14 * 60 * 1000);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});
