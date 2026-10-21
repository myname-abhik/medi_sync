import React from "react";
import { Link } from "react-router-dom";
import Style from "../../css/button.module.css";

const Button = ({ link = "/", text = "Button", type = "Link", newClass = "", ...props }) => {
  const className = `${Style.button} ${newClass}`.trim();
  if (type === "a") {
    return (
      <a href={link} className={className} {...props}>
        {text}
      </a>
    );
  }
  if (type === "button") {
    return (
      <button className={className} {...props}>
        {text}
      </button>
    );
  }
  return (
    <Link to={link} className={className} {...props}>
      {text}
    </Link>
  );
};

export default Button;
