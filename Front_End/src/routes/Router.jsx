import { Route, createBrowserRouter, createHashRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import {
  Cart,
  Dashboard,
  Home,
  Login,
  Products,
  Services,
  Signup,
  Chats,
  Meetings,
  Precriptions,
  Error,
  Notifications,
} from "../pages";
import Room from "../pages/Room/Room";
import RequireAuth from "../Components/RequireAuth";

// Hash routing is only used for the single-file preview build (VITE_HASH_ROUTER=true).
const createRouter = import.meta.env.VITE_HASH_ROUTER === "true" ? createHashRouter : createBrowserRouter;

const router = createRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="services" element={<Services />} />
      <Route path="products" element={<Products />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route element={<RequireAuth />}>
        <Route path="user/dashboard" element={<Dashboard />} />
        <Route path="user/cart" element={<Cart />} />
        <Route path="user/notifications" element={<Notifications />} />
        <Route path="user/chats" element={<Chats />} />
        <Route path="user/meetings" element={<Meetings />} />
        <Route path="user/precriptions" element={<Precriptions />} />
        <Route path="room/:roomId" element={<Room />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Route>
  )
);

export default router;
