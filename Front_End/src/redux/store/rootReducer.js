import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import meetingReducer from "../features/meetingSlice";
import cartReducer from "../features/cartSlice";
import notificationReducer from "../features/notificationSlice";

const rootReducer = combineReducers({
  user: userReducer,
  meet: meetingReducer,
  cart: cartReducer,
  notifications: notificationReducer,
});

export default rootReducer;
