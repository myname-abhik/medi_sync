const jwt = require("jsonwebtoken");

const getSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set. Copy .env.example to .env and set it.");
  return process.env.JWT_SECRET;
};

// Never put the password hash (or the cart) into a token.
function toPublicUser(user) {
  const { password, Product_Cart, __v, ...rest } = typeof user.toObject === "function" ? user.toObject() : user;
  return rest;
}

function setUser(user) {
  return jwt.sign({ user: toPublicUser(user) }, getSecret(), { expiresIn: "7d" });
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

module.exports = { setUser, getUser, toPublicUser };
