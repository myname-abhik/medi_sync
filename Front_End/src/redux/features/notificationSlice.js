import { createSlice, nanoid } from "@reduxjs/toolkit";
import { logout } from "./userSlice";

const initialState = { owner: null, items: [] };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    hydrateNotifications: (state, { payload }) => {
      state.owner = payload.owner;
      state.items = payload.items;
    },
    addNotification: {
      reducer: (state, { payload }) => {
        state.items.unshift(payload);
      },
      prepare: ({ type = "info", title, body }) => ({
        payload: { id: nanoid(), type, title, body, time: new Date().toISOString(), read: false },
      }),
    },
    markRead: (state, { payload }) => {
      const n = state.items.find((i) => i.id === payload);
      if (n) n.read = true;
    },
    markAllRead: (state) => {
      state.items.forEach((i) => (i.read = true));
    },
    removeNotification: (state, { payload }) => {
      state.items = state.items.filter((i) => i.id !== payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { hydrateNotifications, addNotification, markRead, markAllRead, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
