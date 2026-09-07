import mongoose from "mongoose";
import axios from "axios";

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  const db = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  cachedDb = db;
  return db;
}

async function sendBrevoEmail(data) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const MY_EMAIL = process.env.MY_EMAIL || "alonesurvivor03@gmail.com";

  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY is not configured; skipping email dispatch.");
    return null;
  }

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#000000;padding:48px 48px 40px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#666666;">Portfolio — Contact</p>
              <h1 style="margin:0;font-size:42px;font-weight:900;line-height:1;color:#ffffff;letter-spacing:-0.03em;">New<br/>Message.</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:32px 48px 0;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">From</p>
              <p style="margin:0;font-size:24px;font-weight:700;color:#000000;letter-spacing:-0.02em;">${data.firstName} ${data.lastName}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:24px 48px 0;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">Email</p>
              <a href="mailto:${data.email}" style="font-size:16px;font-weight:500;color:#000000;text-decoration:none;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:24px 48px 0;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">Subject</p>
              <p style="margin:0;font-size:20px;font-weight:600;color:#000000;">${data.subject}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:32px 48px 48px;">
              <p style="margin:0 0 16px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">Message</p>
              <p style="margin:0;font-size:17px;font-weight:400;line-height:1.75;color:#1a1a1a;white-space:pre-wrap;">${data.message}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#000000;padding:24px 48px;">
              <p style="margin:0;font-size:11px;font-weight:500;color:#666666;">ANUJ SINGH — PORTFOLIO</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const payload = {
    sender: {
      name: "Portfolio Contact Form",
      email: MY_EMAIL,
    },
    to: [{ email: MY_EMAIL, name: "Anuj Singh" }],
    replyTo: {
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
    },
    subject: `New Message — ${data.subject}`,
    htmlContent: htmlBody,
  };

  const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  return response.data;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { firstName, lastName, email, subject, message } = req.body || {};

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required: firstName, lastName, email, subject, message",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const contactData = { firstName, lastName, email, subject, message };

    // Connect and save to DB, and send Brevo email
    await connectToDatabase();
    const contact = new Contact(contactData);
    await contact.save();

    // Send email (non-blocking if it fails, or captured)
    try {
      await sendBrevoEmail(contactData);
    } catch (emailErr) {
      console.warn("Email notification failed, but contact saved:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent and saved successfully.",
    });
  } catch (error) {
    console.error("Vercel Serverless Contact API Error:", error.message);
    return res.status(500).json({
      error: "Failed to process your message. Please try again later.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
