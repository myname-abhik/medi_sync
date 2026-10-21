const express = require("express");
const { handleUserSignup, handleUserLogin, handleUsercart, handleUsercart_user, handleUpdateProfile } = require("../controllers/user");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/http");

const user = express.Router();

user.post("/signup", asyncHandler(handleUserSignup));
user.post("/login", asyncHandler(handleUserLogin));

user.post("/addtocart", requireAuth, asyncHandler(handleUsercart));
user.get("/cart/:id", requireAuth, asyncHandler(handleUsercart_user));
user.post("/dashboard/:id", requireAuth, asyncHandler(handleUpdateProfile));

module.exports = user;
