import React, { useEffect, useState } from "react";
import Style from "../../css/products.module.css";
import { Button } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addItem } from "../../redux/features/cartSlice";
import { formatPrice, getPricing } from "../../utils/format";

const ProductCard = ({ data, onStoreClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = useSelector((state) => state.user.status);
  const [added, setAdded] = useState(false);
  const { price, original, pct } = getPricing(data);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const addToCart = () => {
    if (!loggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    dispatch(addItem({ productId: data._id }));
    setAdded(true);
  };

  return (
    <div className={Style.main}>
      <div className={Style.card}>
        <div className={Style.pic}>
          <img src={data.Product_Image} alt={data.Product_Title} loading="lazy" />
        </div>
        <div className={Style.txt}>
          <h2>{data.Product_Title}</h2>
          <ul>
            <li className={Style.list}>{data.Product_description}</li>
          </ul>
          <div>
            <Button text={added ? "Added to cart" : "Add to Cart"} onClick={addToCart} type="button" />
          </div>
        </div>
        <div className={Style.price}>
          <h1>{formatPrice(price)}</h1>
          {pct > 0 && (
            <div className={Style.pricing}>
              <p className={Style.dprice}>{formatPrice(original)}</p>
              <p className={Style.dperc}>{pct}% off</p>
            </div>
          )}
          <p className={Style.avltxt}>Available On</p>
          <div>
            <button type="button" className={Style.storeBtn} onClick={() => onStoreClick?.(data.Product_available?.store_name || "")}>
              {data.Product_available?.store_name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
