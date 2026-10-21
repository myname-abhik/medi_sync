const product_Schema = require("../models/Product_Schema");
const { HttpError, uploadImage, asList } = require("../utils/http");

// POST /api/v1/products/medicine (admin) - multipart form with a "photos" file
async function available(req, res) {
  const { Titles, Description, Product_price, Product_Disc, store_id, store_Name, category } = req.body;
  if (!Titles || !Description || !Product_price || !store_id || !store_Name) {
    throw new HttpError(400, "Titles, Description, Product_price, store_id and store_Name are required.");
  }
  if (!req.files?.photos) throw new HttpError(400, "A product photo is required (field name: photos).");

  const product = await product_Schema.create({
    Product_Title: Titles,
    Product_description: Description,
    product_price: Product_price,
    product_Discount: Product_Disc || "0%",
    category,
    Product_Image: await uploadImage(req.files.photos, "products"),
    Product_available: { store_name: store_Name, store_Id: store_id },
    product_specifications: asList(req.body.specification),
  });
  res.status(201).json(product);
}

// GET /api/v1/products/medicine
async function show(req, res) {
  res.json(await product_Schema.find({}).sort({ createdAt: 1 }));
}

// GET /api/v1/products/medicine/:id
async function showOne(req, res) {
  const product = await product_Schema.findById(req.params.id).catch(() => null);
  if (!product) throw new HttpError(404, "Product not found.");
  res.json(product);
}

module.exports = { available, show, showOne };
