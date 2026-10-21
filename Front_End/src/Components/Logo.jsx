import React from "react";
import Style from "../css/logo.module.css";
import logo from "../assets/MedicoAI.png";

const Logo = () => {
  return (
    <div className={Style.logo}>
      <img src={logo} alt="logo" />
      <div className={Style.logoTitle}>Medico AI</div>
    </div>
  );
};

export default Logo;
