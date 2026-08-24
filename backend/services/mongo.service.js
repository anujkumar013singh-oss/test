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

let connectionPromise = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  try {
    connectionPromise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    await connectionPromise;
    console.log("✓ Connected to MongoDB Atlas");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
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
    connectionPromise = null;
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
    throw error;
  }
}