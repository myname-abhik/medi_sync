require("dotenv").config();
const os = require("os");
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const { connectToMongoDB, getDbHint } = require("./connect");
const { connectToCloudinary } = require("./cloudinaryconnect");

// On serverless hosts an unhandled rejection can kill the instance mid-request. Log it and carry on.
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));

if (!process.env.JWT_SECRET) console.warn("JWT_SECRET is not set - login and signup will fail until it is.");

const app = express();
const dbReady = () => mongoose.connection.readyState === 1;

const origins = (process.env.CLIENT_ORIGIN || "").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
// Vercel rejects request bodies over 4.5 MB before they reach the app, so stay below it and answer with a clean 413.
app.use(fileUpload({ useTempFiles: true, tempFileDir: os.tmpdir(), limits: { fileSize: 4 * 1024 * 1024 }, abortOnLimit: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// The website calls this to decide between the API and its built-in data: db=false means "not usable yet".
app.get("/", async (req, res) => {
  await connectToMongoDB();
  const db = dbReady();
  res.json(db ? { message: "Server is running", db } : { message: "Server is running", db, hint: getDbHint() });
});

// Admin panel (static page, loads even when the database is down)
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

// Every API route needs the database: wait for it (cached), and if it is unavailable answer immediately
// with a clear 503 rather than hanging until the platform kills the function.
app.use("/api", async (req, res, next) => {
  await connectToMongoDB();
  if (!dbReady()) {
    return res.status(503).json({ message: `The database is not connected. ${getDbHint()}`.trim() });
  }
  next();
});

app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/service", require("./routes/service"));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/admin", require("./routes/admin"));

app.use((req, res) => res.status(404).json({ message: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || (err.name === "ValidationError" ? 400 : err.code === 11000 ? 409 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? "Something went wrong on the server." : err.message });
});

connectToMongoDB();
connectToCloudinary();

// Vercel runs the exported app as a serverless function; locally we listen on a port.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
}

module.exports = app;
