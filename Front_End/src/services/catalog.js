import axios from "axios";
import { API_URL } from "../config";
import { checkApi, resetApiCheck } from "./mode";
import staticProducts from "../data/products";
import staticDoctors from "../data/doctors";

// When the backend is available the lists come from it; if it is unreachable (or the database
// hasn't been seeded yet) we fall back to the bundled static data so the pages are never empty.
const fromApi = async (path, fallback) => {
  if (!(await checkApi())) return fallback;
  try {
    const { data } = await axios.get(`${API_URL}${path}`);
    return Array.isArray(data) && data.length ? data : fallback;
  } catch (err) {
    resetApiCheck();
    console.warn(`Could not load ${path}, using bundled data instead.`, err.message);
    return fallback;
  }
};

export const getProducts = () => fromApi("api/v1/products/medicine", staticProducts);
export const getDoctors = () => fromApi("api/v1/service/services", staticDoctors);

// Everything that can end up in a cart: the live list plus the bundled items (prescriptions
// always point at bundled products, even when the Products page is served by the backend).
export const getCatalog = async () => {
  const live = await getProducts();
  return [...live, ...staticProducts.filter((p) => !live.some((l) => l._id === p._id))];
};
