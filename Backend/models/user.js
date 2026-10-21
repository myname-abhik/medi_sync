const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // bcrypt hash (older accounts may still hold plain text until their next login, see controllers/user.js)
    password: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    Product_Cart: [
      {
        Product_Id: { type: String },
        status: { type: String },
      },
    ],
    Image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user_medico", userSchema);
