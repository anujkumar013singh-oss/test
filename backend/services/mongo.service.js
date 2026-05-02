import mongoose from "mongoose";

// ═══════════════════════════════════════════════════
// MongoDB Connection and Contact Schema
// ═══════════════════════════════════════════════════

const MONGO_URI = process.env.MONGO_URI;

// Define Contact Schema
const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Create Contact model
const Contact = mongoose.model("Contact", contactSchema);

/**
 * Connect to MongoDB Atlas
 * @returns {Promise<void>}
 */
export async function connectDB() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not set in environment variables");
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✓ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
}

/**
 * Save contact form submission to MongoDB
 * @param {Object} data - Contact form data
 * @param {string} data.firstName - Sender's first name
 * @param {string} data.lastName - Sender's last name
 * @param {string} data.email - Sender's email
 * @param {string} data.subject - Email subject
 * @param {string} data.message - Email message body
 * @returns {Promise<Object>} Saved contact document
 */
export async function saveContact(data) {
  try {
    const contact = new Contact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    const savedContact = await contact.save();
    console.log(`✓ Contact saved to MongoDB. ID: ${savedContact._id}`);
    return savedContact;
  } catch (error) {
    console.error("Error saving contact to MongoDB:", error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB (useful for graceful shutdown)
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
    throw error;
  }
}
