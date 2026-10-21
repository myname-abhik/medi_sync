const cloudinary = require("cloudinary").v2;

const isCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

async function connectToCloudinary() {
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary is not configured - image uploads are disabled.");
    return;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured");
}

module.exports = { connectToCloudinary, isCloudinaryConfigured };
