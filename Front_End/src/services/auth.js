import axios from "axios";
import { decodeToken } from "react-jwt";
import { API_URL, MODE_SETTING } from "../config";
import { checkApi, resetApiCheck } from "./mode";
import { read, write } from "./storage";

const USERS_KEY = "medisync_users";
export const DEFAULT_AVATAR = "/images/avatar.svg";

// Always available in static mode so the app can be explored without signing up.
export const DEMO_ACCOUNT = { email: "demo@medisync.com", password: "demo1234" };
const DEMO_USER = {
  _id: "u-demo",
  name: "Demo Patient",
  ...DEMO_ACCOUNT,
  phone: "+91 98765 43210",
  address: "Howrah, West Bengal",
  Image: DEFAULT_AVATAR,
  post: "Patient",
};

// ---- static-mode "token": an unsigned JWT-shaped string that only carries the user id ----
const encode = (obj) => {
  let bin = "";
  new TextEncoder().encode(JSON.stringify(obj)).forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
};
const decode = (part) => {
  const bin = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
};
const makeToken = (userId) => `${encode({ alg: "none", typ: "JWT" })}.${encode({ user: { _id: userId } })}.static`;
const isStaticToken = (token) => typeof token === "string" && token.endsWith(".static");

const publicUser = ({ password, Product_Cart, ...rest }) => rest;
const getUsers = () => {
  const users = read(USERS_KEY, []);
  if (!users.some((u) => u._id === DEMO_USER._id)) {
    users.unshift({ ...DEMO_USER });
    write(USERS_KEY, users);
  }
  return users;
};
const apiError = (err) => {
  if (!err?.response) resetApiCheck(); // network failure: re-check availability next time
  return new Error(err?.response?.data?.message || "Could not reach the server. Please try again.");
};

export const signup = async ({ name, email, password }) => {
  name = name?.trim();
  email = email?.trim();
  if (!name || !email || !password) throw new Error("Name, email and password are required.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  if (!(await checkApi())) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const user = { _id: `u-${Date.now().toString(36)}`, name, email, password, phone: "", address: "", Image: DEFAULT_AVATAR, post: "Patient" };
    write(USERS_KEY, [...users, user]);
    return makeToken(user._id);
  }
  try {
    const res = await axios.post(`${API_URL}api/v1/user/signup`, { name, email, password });
    return res.data.token;
  } catch (err) {
    throw apiError(err);
  }
};

export const login = async ({ email, password }) => {
  email = email?.trim();
  if (!email || !password) throw new Error("Enter your email and password.");

  const localLogin = () => {
    const user = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error("Invalid email or password.");
    return makeToken(user._id);
  };
  if (!(await checkApi())) return localLogin();
  try {
    const res = await axios.post(`${API_URL}api/v1/user/login`, { email, password });
    return res.data.token;
  } catch (err) {
    // In auto mode, accounts created while the backend was offline (and the demo account) still work.
    if (MODE_SETTING === "auto" && err?.response?.status === 401) {
      try {
        return localLogin();
      } catch {
        /* fall through to the server's message */
      }
    }
    throw apiError(err);
  }
};

// Turns the cookie value into { user } (or null when it is missing / stale).
export const sessionFromToken = (token) => {
  if (!token) return null;
  try {
    if (isStaticToken(token)) {
      const { user } = decode(token.split(".")[1]);
      const full = getUsers().find((u) => u._id === user._id);
      return full ? { user: publicUser(full) } : null;
    }
    const decoded = decodeToken(token);
    return decoded?.user ? decoded : null;
  } catch {
    return null;
  }
};

const resizeImage = (file, size = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

// Returns a fresh token for the updated user.
export const updateProfile = async (userId, { name, email, phone, address, file }, token) => {
  if (!name?.trim() || !email?.trim()) throw new Error("Name and email can't be empty.");
  if (file && !ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error("Choose a .png, .jpg or .jpeg image.");

  // Accounts that live in localStorage are always updated locally; server accounts go to the API.
  if (isStaticToken(token) || !(await checkApi())) {
    const users = getUsers();
    const i = users.findIndex((u) => u._id === userId);
    if (i < 0) throw new Error("Account not found. Please log in again.");
    if (users.some((u, j) => j !== i && u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error("That email is already used by another account.");
    }
    const Image = file ? await resizeImage(file) : users[i].Image;
    users[i] = { ...users[i], name: name.trim(), email: email.trim(), phone, address, Image };
    write(USERS_KEY, users);
    return makeToken(userId);
  }
  try {
    const form = new FormData();
    if (file) form.append("file", file);
    form.append("name", name.trim());
    form.append("email", email.trim());
    form.append("phone", phone || "");
    form.append("address", address || "");
    const res = await axios.post(`${API_URL}api/v1/user/dashboard/${userId}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.token;
  } catch (err) {
    throw apiError(err);
  }
};
