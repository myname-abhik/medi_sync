import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

// Pages that need an account. The cookie is checked directly so there is no flash of content.
const RequireAuth = () => {
  const [cookies] = useCookies(["user"]);
  const location = useLocation();
  if (!cookies.user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

export default RequireAuth;
