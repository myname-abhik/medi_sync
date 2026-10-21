require("dotenv").config();
const os = require("os");
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const { connectToMongoDB } = require("./connect");
const { connectToCloudinary } = require("./cloudinaryconnect");

const app = express();

const origins = (process.env.CLIENT_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: os.tmpdir(), limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// The website calls this to decide between the API and its built-in data: db=false means "not usable yet".
app.get("/", (req, res) => res.json({ message: "Server is running", db: mongoose.connection.readyState === 1 }));

app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/service", require("./routes/service"));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/admin", require("./routes/admin"));

// Admin panel (static page; every request it makes is protected by the admin key)
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

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
