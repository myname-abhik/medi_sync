const crypto = require("crypto");
const { getUser } = require("../service/auth");
const { HttpError } = require("../utils/http");

// Expects "Authorization: Bearer <token>" and sets req.user to the token's user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const payload = getUser(header.startsWith("Bearer ") ? header.slice(7) : null);
  if (!payload?.user?._id) return next(new HttpError(401, "Please log in to continue."));
  req.user = payload.user;
  next();
}

// Protects the catalogue-management endpoints with a shared secret in the x-admin-key header.
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return next(new HttpError(403, "Admin endpoints are disabled. Set ADMIN_KEY on the server."));
  const given = Buffer.from(String(req.headers["x-admin-key"] || ""));
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
    return next(new HttpError(403, "Invalid admin key."));
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
