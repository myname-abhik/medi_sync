import React, { useEffect, useRef, useState } from "react";
import ProfileMale from "../../assets/Profile-Male.png";
import Style from "../../css/profile.module.css";
import { MdSpaceDashboard, MdNotifications } from "react-icons/md";
import { FaShoppingCart, FaFilePrescription } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { LuLogOut } from "react-icons/lu";
import { logout } from "../../redux/features/userSlice";
import { IoChatbubbleEllipses } from "react-icons/io5";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["user"]);
  const menuRef = useRef();
  const user = useSelector((state) => state.user.userData?.user);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, i) => sum + i.qty, 0));
  const unread = useSelector((state) => state.notifications.items.filter((n) => !n.read).length);

  const close = () => setOpen(false);
  const handleLogout = () => {
    close();
    removeCookie("user", { path: "/" });
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const badge = (n) => (n > 0 ? <span className={Style.badge}>{n}</span> : null);

  return (
    <div className={Style.profile} ref={menuRef}>
      <div className={Style.profileImgWrapper} onClick={() => setOpen((o) => !o)}>
        <img className={Style.profileImg} src={user?.Image || ProfileMale} alt={user?.name || "Profile"} onError={(e) => (e.currentTarget.src = ProfileMale)} />
        {unread > 0 && <span className={Style.dot} />}
      </div>
      <ul className={`${Style.dropDownMenu} ${open ? Style.active : Style.inactive}`}>
        <li>
          <Link to="/user/dashboard" className={Style.dropDownMenuItem} onClick={close}>
            <MdSpaceDashboard />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/user/cart" className={Style.dropDownMenuItem} onClick={close}>
            <FaShoppingCart />
            Your Cart {badge(cartCount)}
          </Link>
        </li>
        <li>
          <Link to="/user/meetings" className={Style.dropDownMenuItem} onClick={close}>
            <SiGooglemeet />
            Meetings
          </Link>
        </li>
        <li>
          <Link to="/user/chats" className={Style.dropDownMenuItem} onClick={close}>
            <IoChatbubbleEllipses />
            Chats
          </Link>
        </li>
        <li>
          <Link to="/user/precriptions" className={Style.dropDownMenuItem} onClick={close}>
            <FaFilePrescription />
            Prescriptions
          </Link>
        </li>
        <li>
          <Link to="/user/notifications" className={Style.dropDownMenuItem} onClick={close}>
            <MdNotifications />
            Notifications {badge(unread)}
          </Link>
        </li>
        <li>
          <div className={Style.dropDownMenuItem} onClick={handleLogout}>
            <LuLogOut />
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
