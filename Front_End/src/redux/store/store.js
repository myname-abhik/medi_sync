import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { attachPersistence } from "../persist";

const store = configureStore({
  reducer: rootReducer,
});

attachPersistence(store);

export default store;
