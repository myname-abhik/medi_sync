import { describe, it, expect } from "vitest";
import reducer, { addItem, setQty, removeItem, hydrateCart, MAX_QTY } from "./cartSlice";
import { logout } from "./userSlice";

describe("cartSlice", () => {
  const start = reducer(undefined, hydrateCart({ owner: "u1", items: [] }));
  it("adds and merges items", () => {
    let s = reducer(start, addItem({ productId: "a" }));
    s = reducer(s, addItem({ productId: "a" }));
    expect(s.items).toEqual([{ productId: "a", qty: 2 }]);
  });
  it("clamps quantity between 1 and the maximum", () => {
    let s = reducer(start, addItem({ productId: "a" }));
    s = reducer(s, setQty({ productId: "a", qty: 0 }));
    expect(s.items[0].qty).toBe(1);
    s = reducer(s, setQty({ productId: "a", qty: 99 }));
    expect(s.items[0].qty).toBe(MAX_QTY);
  });
  it("removes items and resets on logout", () => {
    let s = reducer(start, addItem({ productId: "a" }));
    s = reducer(s, removeItem("a"));
    expect(s.items).toHaveLength(0);
    s = reducer(reducer(start, addItem({ productId: "b" })), logout());
    expect(s).toEqual({ owner: null, items: [] });
  });
});
