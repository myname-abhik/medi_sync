const mongoose = require("mongoose");

async function connectToMongoDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI is not set - database features are unavailable. Copy .env.example to .env.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

module.exports = { connectToMongoDB };
