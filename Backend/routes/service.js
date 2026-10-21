const express = require("express");
const { service_doctor, show_service_doctor } = require("../controllers/service");
const { requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/http");

const service = express.Router();

service.get("/services", asyncHandler(show_service_doctor));
service.post("/services", requireAdmin, asyncHandler(service_doctor));

module.exports = service;
