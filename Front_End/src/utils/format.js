import { CURRENCY } from "../config";

export const formatPrice = (n) => `${CURRENCY}${(Number(n) || 0).toFixed(2)}`;

// product_price is the price the customer pays; product_Discount ("20%") is how much was taken off,
// so the struck-through "original" price is derived rather than hard-coded.
export const getPricing = (product) => {
  const price = parseFloat(product?.product_price) || 0;
  const pct = parseFloat(String(product?.product_Discount ?? "0").replace("%", "")) || 0;
  const original = pct > 0 && pct < 100 ? price / (1 - pct / 100) : price;
  return { price, original: Math.round(original * 100) / 100, pct };
};

const TZ = "Asia/Kolkata";
export const formatDateTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "-", time: "-" };
  return {
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: TZ }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: TZ }),
  };
};

export const timeAgo = (iso) => {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
};

export const clockTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
