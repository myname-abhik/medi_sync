import { describe, it, expect } from "vitest";
import { getPricing, formatPrice } from "./format";

describe("getPricing", () => {
  it("derives the struck-through price from the discount", () => {
    expect(getPricing({ product_price: "8.00", product_Discount: "20%" })).toEqual({ price: 8, original: 10, pct: 20 });
  });
  it("handles zero / missing discounts", () => {
    expect(getPricing({ product_price: "3.20", product_Discount: "0%" }).original).toBe(3.2);
    expect(getPricing({ product_price: "3.20" }).pct).toBe(0);
  });
  it("formats money", () => {
    expect(formatPrice("2.4")).toBe("$2.40");
  });
});
