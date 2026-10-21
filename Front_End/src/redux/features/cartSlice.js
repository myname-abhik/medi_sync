import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./userSlice";

export const MAX_QTY = 10;
const initialState = { owner: null, items: [] }; // items: [{ productId, qty }]

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, { payload }) => {
      state.owner = payload.owner;
      state.items = payload.items;
    },
    addItem: (state, { payload: { productId, qty = 1 } }) => {
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.qty = Math.min(MAX_QTY, item.qty + qty);
      else state.items.push({ productId, qty: Math.min(MAX_QTY, qty) });
    },
    setQty: (state, { payload: { productId, qty } }) => {
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.qty = Math.max(1, Math.min(MAX_QTY, qty));
    },
    removeItem: (state, { payload }) => {
      state.items = state.items.filter((i) => i.productId !== payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { hydrateCart, addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
