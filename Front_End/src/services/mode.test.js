import { describe, it, expect, vi, beforeEach } from "vitest";

// config reads import.meta.env when first imported, so each test sets the env and re-imports.
const load = async (setting, apiResponse) => {
  vi.resetModules();
  vi.stubEnv("VITE_USE_STATIC", setting);
  const get = vi.fn(() => (apiResponse instanceof Error ? Promise.reject(apiResponse) : Promise.resolve(apiResponse)));
  vi.doMock("axios", () => ({ default: { get, post: vi.fn() } }));
  const mode = await import("./mode");
  const catalog = await import("./catalog");
  const products = (await import("../data/products")).default;
  return { mode, catalog, products, get };
};

beforeEach(() => vi.unstubAllEnvs());

describe("automatic API / static switching", () => {
  it("uses the API when it is reachable and the database is connected", async () => {
    const { mode, catalog, get } = await load("auto", { status: 200, data: { message: "Server is running", db: true } });
    expect(await mode.checkApi()).toBe(true);
    get.mockImplementation((url) =>
      Promise.resolve(url.includes("products") ? { status: 200, data: [{ _id: "x1", Product_Title: "From DB" }] } : { status: 200, data: { db: true } })
    );
    mode.resetApiCheck();
    const list = await catalog.getProducts();
    expect(list).toEqual([{ _id: "x1", Product_Title: "From DB" }]);
  });

  it("falls back to static data when the backend is unreachable", async () => {
    const { mode, catalog, products } = await load("auto", new Error("ECONNREFUSED"));
    expect(await mode.checkApi()).toBe(false);
    expect(await catalog.getProducts()).toEqual(products);
  });

  it("falls back to static data when the server is up but the database is not connected", async () => {
    const { mode } = await load("auto", { status: 200, data: { message: "Server is running", db: false } });
    expect(await mode.checkApi()).toBe(false);
  });

  it("falls back when the API is up but the database is empty", async () => {
    const { mode, catalog, get, products } = await load("auto", { status: 200, data: { db: true } });
    expect(await mode.checkApi()).toBe(true);
    get.mockImplementation(() => Promise.resolve({ status: 200, data: [] }));
    expect(await catalog.getProducts()).toEqual(products);
  });

  it("re-checks after the cache is reset, so a backend started later is picked up", async () => {
    const { mode, get } = await load("auto", new Error("down"));
    expect(await mode.checkApi()).toBe(false);
    get.mockImplementation(() => Promise.resolve({ status: 200, data: { db: true } }));
    mode.resetApiCheck();
    expect(await mode.checkApi()).toBe(true);
  });

  it("honours the forced settings without calling the server", async () => {
    let r = await load("true", { status: 200, data: { db: true } });
    expect(await r.mode.checkApi()).toBe(false);
    expect(r.get).not.toHaveBeenCalled();
    r = await load("false", new Error("down"));
    expect(await r.mode.checkApi()).toBe(true);
    expect(r.get).not.toHaveBeenCalled();
  });
});
