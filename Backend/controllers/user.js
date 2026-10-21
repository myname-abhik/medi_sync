const bcrypt = require("bcryptjs");
const User = require("../models/user");
const product_Schema = require("../models/Product_Schema");
const { setUser } = require("../service/auth");
const { HttpError, uploadImage } = require("../utils/http");

const DEFAULT_AVATAR = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
const looksHashed = (value) => /^\$2[aby]\$/.test(value);
const normEmail = (email) => String(email || "").trim().toLowerCase();

async function handleUserSignup(req, res) {
  const { name, password } = req.body;
  const email = normEmail(req.body.email);
  if (!name?.trim() || !email || !password) throw new HttpError(400, "Name, email and password are required.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, "Enter a valid email address.");
  if (password.length < 6) throw new HttpError(400, "Password must be at least 6 characters.");

  if (await User.exists({ email })) throw new HttpError(409, "An account with this email already exists.");
  const user = await User.create({ name: name.trim(), email, password: await bcrypt.hash(password, 10), Image: DEFAULT_AVATAR });
  res.status(201).json({ token: setUser(user) });
}

async function handleUserLogin(req, res) {
  const email = normEmail(req.body.email);
  const { password } = req.body;
  if (!email || !password) throw new HttpError(400, "Enter your email and password.");

  const user = await User.findOne({ email });
  let ok = false;
  if (user) {
    if (looksHashed(user.password)) {
      ok = await bcrypt.compare(password, user.password);
    } else if (user.password === password) {
      // Account created before passwords were hashed: accept once, then upgrade it.
      ok = true;
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }
  if (!ok) throw new HttpError(401, "Invalid email or password.");
  res.json({ token: setUser(user) });
}

async function handleUsercart(req, res) {
  const { Product_Id, Status = "Pending" } = req.body;
  if (!Product_Id) throw new HttpError(400, "Product_Id is required.");
  if (!(await product_Schema.exists({ _id: Product_Id }))) throw new HttpError(404, "Product not found.");
  await User.updateOne({ _id: req.user._id }, { $push: { Product_Cart: { Product_Id: String(Product_Id), status: String(Status) } } });
  res.json({ message: "Added to cart" });
}

async function handleUsercart_user(req, res) {
  if (req.params.id !== String(req.user._id)) throw new HttpError(403, "You can only view your own cart.");
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, "User not found.");
  const ids = user.Product_Cart.map((item) => item.Product_Id);
  res.json(await product_Schema.find({ _id: { $in: ids } }));
}

async function handleUpdateProfile(req, res) {
  const { id } = req.params;
  if (id !== String(req.user._id)) throw new HttpError(403, "You can only update your own profile.");

  const updates = {};
  for (const field of ["name", "phone", "address"]) {
    if (typeof req.body[field] === "string") updates[field] = req.body[field].trim();
  }
  if (req.body.email !== undefined) {
    const email = normEmail(req.body.email);
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, "Enter a valid email address.");
    if (await User.exists({ email, _id: { $ne: id } })) throw new HttpError(409, "That email is already used by another account.");
    updates.email = email;
  }
  if (updates.name === "") throw new HttpError(400, "Name can't be empty.");
  if (req.files?.file) updates.Image = await uploadImage(req.files.file, "avatars");

  const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
  if (!user) throw new HttpError(404, "User not found.");
  res.json({ token: setUser(user) });
}

module.exports = { handleUserSignup, handleUserLogin, handleUsercart, handleUsercart_user, handleUpdateProfile };
