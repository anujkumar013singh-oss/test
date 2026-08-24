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

    // Save to MongoDB and send email concurrently using allSettled
    const [dbResult, emailResult] = await Promise.allSettled([
      saveContact(contactData),
      sendEmail(contactData),
    ]);

    if (dbResult.status === "rejected") {
      console.error("❌ MongoDB save error:", dbResult.reason?.message || dbResult.reason);
      return res.status(500).json({
        error: "Failed to save message to database. Please try again.",
        details: process.env.NODE_ENV === "development" ? dbResult.reason?.message : undefined,
      });
    }

    if (emailResult.status === "rejected") {
      console.warn("⚠️ Email notification failed, but contact was successfully saved to MongoDB:", emailResult.reason?.message);
    }

    console.log("✓ Contact form processed successfully (saved to DB)");
    return res.status(200).json({
      success: true,
      message: "Your message has been sent and saved",
    });
  } catch (error) {
    console.error("Error processing contact form:", error.message);
    
    return res.status(500).json({
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
