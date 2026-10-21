const express = require("express");
const c = require("../controllers/admin");
const { requireAdmin } = require("../middleware/auth");
const { asyncHandler: h } = require("../utils/http");

// Everything here needs the x-admin-key header (see ADMIN_KEY in .env).
const admin = express.Router();
admin.use(requireAdmin);

admin.get("/check", c.check);
admin.get("/stats", h(c.stats));

admin.get("/products", h(c.listProducts));
admin.post("/products", h(c.createProduct));
admin.put("/products/:id", h(c.updateProduct));
admin.delete("/products/:id", h(c.deleteProduct));

admin.get("/doctors", h(c.listDoctors));
admin.post("/doctors", h(c.createDoctor));
admin.put("/doctors/:id", h(c.updateDoctor));
admin.delete("/doctors/:id", h(c.deleteDoctor));

admin.get("/users", h(c.listUsers));

module.exports = admin;
