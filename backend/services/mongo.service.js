import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, lowercase: true, trim: true },
    subject:   { type: String, required: true, trim: true },
    message:   { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

// ✅ Vercel serverless fix — reuse existing connection instead of reconnecting every request
let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✓ Reusing existing MongoDB connection");
    return;
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // ✅ Disable buffering for serverless
    });

    isConnected = true;
    console.log("✓ Connected to MongoDB Atlas");
  } catch (error) {
    isConnected = false;
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
}

export async function saveContact(data) {
  try {
    // ✅ Always ensure connection before saving in serverless
    await connectDB();

    const contact = new Contact({
      firstName: data.firstName,
      lastName:  data.lastName,
      email:     data.email,
      subject:   data.subject,
      message:   data.message,
    });

    const savedContact = await contact.save();
    console.log(`✓ Contact saved to MongoDB. ID: ${savedContact._id}`);
    return savedContact;
  } catch (error) {
    console.error("Error saving contact to MongoDB:", error.message);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
    throw error;
  }
}