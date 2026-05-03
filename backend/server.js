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

console.log("✓ Loading routes...");
console.log("✓ Contact routes loaded:", typeof contactRoutes !== "undefined");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost:")) return callback(null, true);

      const allowed = [
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.netlify\.app$/,
        "https://test-yu3u.onrender.com",
      ];

      const isAllowed = allowed.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (isAllowed) return callback(null, true);

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio backend is live" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

console.log("✓ Mounting contact routes at /api...");
app.use("/api", contactRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

setInterval(() => {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => console.log("Self-ping successful:", data.status))
    .catch((err) => console.log("Self-ping failed:", err.message));
}, 14 * 60 * 1000);

connectDB()
  .then(() => {
    console.log("✓ MongoDB connected successfully");
    if (process.env.PORT) {
      console.log("✓ Using PORT from environment:", process.env.PORT);
    }
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Backend URL: ${BACKEND_URL}`);
      console.log("✓ Routes registered:");
      console.log("  - GET  /");
      console.log("  - GET  /api/health");
      console.log("  - POST /api/contact");
    });
  })
  .catch((err) => {
    console.error("⚠️ MongoDB connection failed, but starting server anyway:");
    console.error(err.message);
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log("⚠️ Database operations will fail until MongoDB is connected");
      console.log("✓ Routes registered:");
      console.log("  - GET  /");
      console.log("  - GET  /api/health");
      console.log("  - POST /api/contact");
    });
  });

  const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8082",
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.netlify\.app$/,
  "https://test-yu3u.onrender.com",
  "https://solodeveloper.in",        // ← add this
  "https://www.solodeveloper.in",    // ← add this
];