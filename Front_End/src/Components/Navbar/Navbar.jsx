import React, { useEffect, useRef, useState } from "react";
import Style from "../../css/nav.module.css";
import logo from "../../assets/MedicoAI.png";
import { Link } from "react-router-dom";
import { Button } from "../../Components";
import { IoMenu, IoClose, IoHomeSharp } from "react-icons/io5";
import { MdMedicalServices } from "react-icons/md";
import { CgPill } from "react-icons/cg";
import Profile from "./Profile";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { startSession } from "../../services/session";

const Navbar = () => {
  const [isUser, setIsUser] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [cookies, , removeCookie] = useCookies(["user"]);
  const dispatch = useDispatch();
  const sideMenuRef = useRef();

  const toggleSideMenu = () => setSideMenuOpen((open) => !open);
  const closeSideMenu = () => setSideMenuOpen(false);

  useEffect(() => {
    if (!sideMenuOpen) return;
    const handleOutsideClick = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) closeSideMenu();
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [sideMenuOpen]);

  // Keep Redux in sync with the session cookie (page refresh, login, logout, expired accounts).
  useEffect(() => {
    if (cookies.user && startSession(dispatch, cookies.user)) {
      setIsUser(true);
      return;
    }
    if (cookies.user) removeCookie("user", { path: "/" }); // token no longer valid
    dispatch(logout());
    setIsUser(false);
  }, [cookies.user, dispatch, removeCookie]);

  return (
    <nav className={Style.navBar}>
      <Link to="/" className={Style.logo} onClick={closeSideMenu} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={logo} alt="Medisync logo" />
        <div className={Style.logoTitle}>Medisync</div>
      </Link>

      <div className={`${Style.navLinks} ${sideMenuOpen ? Style.active : ""}`} ref={sideMenuRef}>
        <Link className={Style.navItems} to="/" onClick={closeSideMenu}>
          <IoHomeSharp className={Style.navIcon} />
          Home
        </Link>
        <Link className={Style.navItems} to="/services" onClick={closeSideMenu}>
          <MdMedicalServices className={Style.navIcon} />
          Services
        </Link>
        <Link className={Style.navItems} to="/products" onClick={closeSideMenu}>
          <CgPill className={Style.navIcon} />
          Products
        </Link>
      </div>

      <div className={Style.navButtons}>
        {isUser ? (
          <Profile />
        ) : (
          <>
            <Button link="/login" text="Login" onClick={closeSideMenu} />
            <Button link="/signup" text="Signup" onClick={closeSideMenu} />
          </>
        )}
        <div className={Style.menu} onClick={toggleSideMenu}>
          {sideMenuOpen ? <IoClose /> : <IoMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
