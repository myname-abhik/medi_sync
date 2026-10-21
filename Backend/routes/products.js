const express = require("express");
const { available, show, showOne } = require("../controllers/product");
const { requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/http");

const products = express.Router();

products.get("/medicine", asyncHandler(show));
products.get("/medicine/:id", asyncHandler(showOne));
products.post("/medicine", requireAdmin, asyncHandler(available));

module.exports = products;
