import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../Components";
import ChatBot from "../Components/ChatBot/ChatBot";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <ChatBot/>
      <Footer />
    </>
  );
};

export default Layout;
