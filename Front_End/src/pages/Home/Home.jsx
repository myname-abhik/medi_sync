import React from "react";
import Style from "../../css/hero.module.css";
import hero1 from "../../assets/heroImage1.png";
import HandWithapill from "../../assets/HandWithapill.png";
import { Button } from "../../Components";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const openAssistant = () => window.dispatchEvent(new Event("medisync:open-assistant"));

  return (
    <>
      <section className={Style.hero1}>
        <div className={Style.imageBg}>
          <div className={Style.imageText}>
            <h1>Provide Best Quality</h1>
            <h1> Medicine & Service</h1>
            <p>Order genuine medicines and health devices, talk to verified doctors over video and keep every prescription in one place.</p>
            <div className={Style.heroBtn}>
              <Button text="Services" type="Link" link="/services" />
              <Button text="Products" type="Link" link="/products" />
            </div>
          </div>
        </div>
        <img className={Style.image} src={hero1} alt="Doctor with a patient" />
      </section>

      <section className={Style.heroCards}>
        <div className={Style.heroCard1}>
          <div className={Style.heroCard1Part1}>
            <img src={HandWithapill} alt="" className={Style.heroCardsIcon} />
            <h1>Medicine</h1>
            <p>Tablets, syrups, devices and first aid,</p>
            <p>delivered from trusted local pharmacies.</p>
            <div className={Style.paraIcon} onClick={() => navigate("/products")} role="link" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && navigate("/products")} style={{ cursor: "pointer" }}>
              <p>Shop Online</p>
              <HiOutlineArrowLongRight className={Style.icon} />
            </div>
          </div>
          <div className={Style.heroCard1Part2}>
            <img src={HandWithapill} alt="" className={Style.heroCardsIcon} />
            <h1>Health Assistant</h1>
            <p>Quick answers about symptoms, medicines</p>
            <p>and booking a doctor, any time of day.</p>
            <div className={Style.paraIcon} onClick={openAssistant} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openAssistant()} style={{ cursor: "pointer" }}>
              <p>Chat Now</p>
              <HiOutlineArrowLongRight className={Style.icon} />
            </div>
          </div>
        </div>
        <div className={Style.heroCard2}>
          <div>
            <h1>Join Member Now</h1>
            <h1>Get 10% Off</h1>
            <p>Create a free account and use code MEDI10 on your first order.</p>
            <Button text="Join Now" type="Link" link="/signup" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
