const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { isCloudinaryConfigured } = require("../cloudinaryconnect");

// Express 4 does not catch rejected promises, so every async handler goes through this.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Uploads an express-fileupload file to Cloudinary and removes the temp file afterwards.
async function uploadImage(file, folder) {
  if (!isCloudinaryConfigured()) throw new HttpError(503, "Image uploads are not configured on this server.");
  if (!/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) throw new HttpError(400, "Only png, jpg and webp images are allowed.");
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: `medisync/${folder}` });
    return result.secure_url;
  } finally {
    fs.unlink(file.tempFilePath, () => {});
  }
}

const asList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

module.exports = { asyncHandler, HttpError, uploadImage, asList };
