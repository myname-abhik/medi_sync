// Loads the sample products and doctors (same data the frontend uses in static mode) into MongoDB.
// Usage: npm run seed   (needs MONGO_URI). Safe to run repeatedly - existing items are updated, not duplicated.
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product_Schema");
const Doctor = require("./models/doctor_available");
const products = require("./seed/products.json");
const doctors = require("./seed/doctors.json");

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Copy .env.example to .env first.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  for (const p of products) await Product.updateOne({ Product_Title: p.Product_Title }, { $set: p }, { upsert: true });
  for (const d of doctors) await Doctor.updateOne({ doctor_id: d.doctor_id }, { $set: d }, { upsert: true });
  console.log(`Seeded ${products.length} products and ${doctors.length} doctors.`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
