import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const { connectDB } = await import("./services/mongo.service.js");
const { default: contactRoutes } = await import("./routes/contact.js");

console.log("✓ Environment loaded. MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
console.log("✓ BREVO_API_KEY:", process.env.BREVO_API_KEY ? "SET" : "NOT SET");

const app = express();
const PORT = process.env.PORT || 3500;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// ✅ FIXED: Single unified CORS config with ALL allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8082",
  "https://test-yu3u.onrender.com",
  "https://solodeveloper.in",
  "https://www.solodeveloper.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Check exact string matches
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Check pattern matches (vercel, netlify previews)
      const patterns = [
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.netlify\.app$/,
        /^http:\/\/localhost:\d+$/,
      ];

      if (patterns.some((p) => p.test(origin))) return callback(null, true);

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio backend is live" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

app.use("/api", contactRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Self-ping to keep Render free tier alive
setInterval(() => {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => console.log("Self-ping successful:", data.status))
    .catch((err) => console.log("Self-ping failed:", err.message));
}, 14 * 60 * 1000);

connectDB()
  .then(() => {
    console.log("✓ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Backend URL: ${BACKEND_URL}`);
    });
  })
  .catch((err) => {
    console.error("⚠️ MongoDB connection failed, starting server anyway:");
    console.error(err.message);
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  });