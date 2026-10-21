const mongoose = require("mongoose");
const Product = require("../models/Product_Schema");
const Doctor = require("../models/doctor_available");
const User = require("../models/user");
const { HttpError, uploadImage } = require("../utils/http");

const text = (v) => (v == null ? "" : String(v).trim());
const splitList = (v) =>
  (Array.isArray(v) ? v : String(v ?? "").split(/[\n,]/)).map((s) => String(s).trim()).filter(Boolean);
const parseBool = (v) => !(v === false || String(v).toLowerCase() === "false" || v === "0" || v === 0);
const checkId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id.");
};

// Image: an uploaded file (needs Cloudinary) or an http(s) URL / site path such as /images/products/x.svg
async function resolveImage(req, folder) {
  if (req.files?.image) return uploadImage(req.files.image, folder);
  const url = text(req.body.image);
  if (url && !/^(https?:\/\/|\/(?!\/))/i.test(url)) throw new HttpError(400, "Image must be an http(s) URL or a path starting with /.");
  return url;
}

const REQUIRED = {
  product: { title: "title", description: "description", price: "price", storeName: "storeName", storeId: "storeId" },
  doctor: { name: "name", profile: "profile", doctorId: "doctorId", address: "address" },
};
const assertRequired = (kind, body, image) => {
  const missing = Object.values(REQUIRED[kind]).filter((k) => text(body[k]) === "");
  if (!image) missing.push("image");
  if (missing.length) throw new HttpError(400, `Missing required field(s): ${missing.join(", ")}.`);
};

function productFields(b) {
  const f = {};
  if (b.title !== undefined) f.Product_Title = text(b.title);
  if (b.description !== undefined) f.Product_description = text(b.description);
  if (b.category !== undefined) f.category = text(b.category);
  if (b.price !== undefined) {
    const n = Number(b.price);
    if (text(b.price) === "" || !(n >= 0)) throw new HttpError(400, "Price must be a number of 0 or more.");
    f.product_price = n.toFixed(2);
  }
  if (b.discount !== undefined) {
    const n = Number(text(b.discount).replace("%", "") || 0);
    if (!(n >= 0 && n < 100)) throw new HttpError(400, "Discount must be between 0 and 99.");
    f.product_Discount = `${n}%`;
  }
  if (b.specifications !== undefined) f.product_specifications = splitList(b.specifications);
  if (b.storeName !== undefined) f["Product_available.store_name"] = text(b.storeName);
  if (b.storeId !== undefined) f["Product_available.store_Id"] = text(b.storeId);
  return f;
}

function doctorFields(b) {
  const f = {};
  if (b.name !== undefined) f.doctor_name = text(b.name);
  if (b.profile !== undefined) f.doctor_profile = text(b.profile);
  if (b.doctorId !== undefined) f.doctor_id = text(b.doctorId);
  if (b.address !== undefined) f.doctor_address = text(b.address);
  if (b.degrees !== undefined) f.doctor_degree = splitList(b.degrees);
  if (b.available !== undefined) f.Doctor_available = parseBool(b.available);
  return f;
}

const apply = (doc, fields) => Object.entries(fields).forEach(([k, v]) => doc.set(k, v));

// ---- generic handlers ----
const list = (Model) => async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 200, 500);
  res.json(await Model.find({}).sort({ createdAt: -1 }).limit(limit));
};

const create = (Model, kind, build, folder, defaults) => async (req, res) => {
  const image = await resolveImage(req, folder);
  assertRequired(kind, req.body, image);
  const doc = new Model();
  apply(doc, { ...defaults, ...build(req.body) });
  doc.set(kind === "product" ? "Product_Image" : "doctor_Image", image);
  await doc.save();
  res.status(201).json(doc);
};

const update = (Model, kind, build, folder) => async (req, res) => {
  checkId(req.params.id);
  const doc = await Model.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Not found.");
  apply(doc, build(req.body));
  const image = await resolveImage(req, folder);
  if (image) doc.set(kind === "product" ? "Product_Image" : "doctor_Image", image);
  await doc.save();
  res.json(doc);
};

const remove = (Model) => async (req, res) => {
  checkId(req.params.id);
  const doc = await Model.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Not found.");
  await Model.deleteOne({ _id: doc._id });
  res.json({ message: "Deleted", id: req.params.id });
};

const productDefaults = { product_Discount: "0%", product_specifications: [] };
const doctorDefaults = { Doctor_available: true, doctor_degree: [] };

module.exports = {
  check: (req, res) => res.json({ ok: true, frontendUrl: process.env.FRONTEND_URL || (process.env.CLIENT_ORIGIN || "").split(",")[0] || "" , cloudinary: require("../cloudinaryconnect").isCloudinaryConfigured() }),
  stats: async (req, res) => {
    const [products, doctors, users] = await Promise.all([Product.countDocuments(), Doctor.countDocuments(), User.countDocuments()]);
    res.json({ products, doctors, users });
  },
  listProducts: list(Product),
  createProduct: create(Product, "product", productFields, "products", productDefaults),
  updateProduct: update(Product, "product", productFields, "products"),
  deleteProduct: remove(Product),
  listDoctors: list(Doctor),
  createDoctor: create(Doctor, "doctor", doctorFields, "doctors", doctorDefaults),
  updateDoctor: update(Doctor, "doctor", doctorFields, "doctors"),
  deleteDoctor: remove(Doctor),
  // read-only; password hashes and carts are never returned
  listUsers: async (req, res) => {
    res.json(await User.find({}, "-password -Product_Cart -__v").sort({ createdAt: -1 }).limit(500));
  },
};
