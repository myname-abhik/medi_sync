// Runtime configuration. Everything here can be overridden from a .env file (see .env.example).

// VITE_USE_STATIC controls where data comes from:
//   unset / "auto" (default): use the backend when it is reachable and its database is connected,
//                             otherwise fall back to the built-in static data. Checked at runtime.
//   "true":  always static (products/doctors from src/data, accounts etc. in localStorage).
//   "false": always use the backend.
const setting = String(import.meta.env.VITE_USE_STATIC ?? "auto").toLowerCase();
export const MODE_SETTING = ["true", "false"].includes(setting) ? setting : "auto";
export const FORCE_STATIC = MODE_SETTING === "true";
export const FORCE_API = MODE_SETTING === "false";

// Backend base URL. Always ends with a slash.
const rawApi = import.meta.env.VITE_API_URL || "http://localhost:8000/";
export const API_URL = rawApi.endsWith("/") ? rawApi : `${rawApi}/`;

export const CURRENCY = "$";

// Optional third-party keys. Real video calls / Chatbase are used automatically when the keys are
// present (and VITE_USE_STATIC is not "true"); otherwise the built-in simulated versions are shown.
export const ZEGO_APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID) || 0;
export const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET || "";
export const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID || "";

// Options used whenever the session cookie is written or removed (must match so removal works).
export const COOKIE_OPTS = { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" };
