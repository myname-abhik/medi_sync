const mongoose = require("mongoose");

// Fail fast instead of queueing queries while disconnected: on Vercel a queued query would hang until
// the platform kills the whole function (10 s on the free plan) and the visitor sees a crash.
mongoose.set("bufferCommands", false);

// One shared connection attempt. On serverless hosts (Vercel) every cold start needs it, and requests
// must wait for it - otherwise the first response says "db: false" even though the database is fine.
let pending = null;
let failedAt = 0;
let lastHint = "";
const RETRY_AFTER_MS = 10000;

mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err.message));
mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected - will reconnect on the next request."));

// Forgive common paste mistakes: surrounding spaces/quotes, or a leading "MONGO_URI=" inside the value.
const cleanUri = (v) => String(v || "").trim().replace(/^[A-Z_]+=\s*/, "").replace(/^["']|["']$/g, "").trim();

// Safe, secret-free explanation shown on GET / while the database is not connected.
const explain = (err) => {
  const m = String(err?.message || err || "").toLowerCase();
  if (/invalid scheme|invalid connection string|malformed|invalid url/.test(m)) return "MONGO_URI is not a valid connection string (check for spaces, quotes, or the text 'MONGO_URI=' inside the value).";
  if (/bad auth|authentication failed/.test(m)) return "MongoDB rejected the username or password in MONGO_URI.";
  if (/enotfound|querysrv|getaddrinfo/.test(m)) return "The cluster address in MONGO_URI could not be found - check the host name.";
  if (/timed out|timeout|etimedout|econnrefused|server selection|could not connect|ssl|tls/.test(m)) return "Could not reach MongoDB - in Atlas open Network Access and allow 0.0.0.0/0.";
  return "Could not connect to MongoDB - check the server logs for details.";
};

const getDbHint = () => lastHint;

function connectToMongoDB() {
  const uri = cleanUri(process.env.MONGO_URI);
  if (!uri) {
    lastHint = "MONGO_URI is not set in the server environment (on Vercel: Settings > Environment Variables, then redeploy).";
    if (!connectToMongoDB.warned) console.warn("MONGO_URI is not set - database features are unavailable. Copy .env.example to .env.");
    connectToMongoDB.warned = true;
    return Promise.resolve(false);
  }
  if (mongoose.connection.readyState === 1) return Promise.resolve(true);
  if (pending) return pending;
  // After a failure, don't make every request wait for another timeout.
  if (Date.now() - failedAt < RETRY_AFTER_MS) return Promise.resolve(false);

  pending = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000, // must stay well under the host's function time limit
      socketTimeoutMS: 20000,
      maxPoolSize: 5, // serverless instances are many and short-lived: keep pools small for Atlas
    })
    .then(() => {
      lastHint = "";
      console.log("Connected to MongoDB");
      return true;
    })
    .catch((err) => {
      lastHint = explain(err);
      console.error("Error connecting to MongoDB:", err.message);
      failedAt = Date.now();
      return false;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

module.exports = { connectToMongoDB, getDbHint };
