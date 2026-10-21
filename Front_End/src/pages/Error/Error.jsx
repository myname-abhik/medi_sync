import React from "react";
import { Link } from "react-router-dom";
import Style from "../../css/common.module.css";
import { Button } from "../../Components";

const Error = () => (
  <section className={Style.page}>
    <div className={Style.empty}>
      <h2>404 - page not found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Button text="Back to home" link="/" />
      <Link to="/products">Browse products</Link>
    </div>
  </section>
);

export default Error;
