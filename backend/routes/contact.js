import express from "express";
import { sendEmail } from "../services/email.service.js";
import { saveContact, disconnectDB } from "../services/mongo.service.js";

const router = express.Router();

// ═══════════════════════════════════════════════════
// POST /api/contact
// Receives form data, sends email via Brevo, saves to MongoDB
// ═══════════════════════════════════════════════════
router.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      console.warn("Missing required fields in contact form submission");
      return res.status(400).json({
        error: "All fields are required: firstName, lastName, email, subject, message",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn(`Invalid email format: ${email}`);
      return res.status(400).json({ error: "Invalid email format" });
    }

    const contactData = { firstName, lastName, email, subject, message };

    // Send email and save to MongoDB in parallel
    // BUG 4 FIX: Keep route logic clean, delegate to services
    const [emailResult, mongoResult] = await Promise.all([
      sendEmail(contactData),
      saveContact(contactData),
    ]);

    console.log("✓ Contact form processed successfully");
    res.status(200).json({
      success: true,
      message: "Your message has been sent and saved",
    });
  } catch (error) {
    console.error("Error processing contact form:", error.message);
    
    // Check if it's a MongoDB connection error
    if (error.message.includes("connect ECONNREFUSED") || 
        error.message.includes("MongoNetworkError") ||
        error.message.includes("server selection timeout")) {
      console.error("⚠️ MongoDB connection failed. Email may still have been sent.");
      return res.status(503).json({
        error: "Service temporarily unavailable. Email sent but not saved to database.",
        details: "Database connection failed. Please try again later.",
      });
    }
    
    res.status(500).json({
      error: "Failed to process your message. Please try again later.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Graceful shutdown handler
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await disconnectDB();
  process.exit(0);
});

export default router;
