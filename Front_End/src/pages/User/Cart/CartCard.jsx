import React from "react";
import { useDispatch } from "react-redux";
import Style from "../../../css/cart.module.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { setQty, removeItem, MAX_QTY } from "../../../redux/features/cartSlice";
import { formatPrice, getPricing } from "../../../utils/format";

const CartCard = ({ item }) => {
  const dispatch = useDispatch();
  const { product, qty } = item;
  const { price } = getPricing(product);

  return (
    <div className={Style.cartCard}>
      <div className={Style.cartImg}>
        <img className={Style.img} src={product.Product_Image} alt={product.Product_Title} />
      </div>
      <div className={Style.cartDetails}>
        <h3>{product.Product_Title}</h3>
        <p>{product.Product_description}</p>
        <button type="button" className={Style.remove} onClick={() => dispatch(removeItem(product._id))}>
          Remove
        </button>
      </div>
      <div className={Style.cartQuantity}>
        <div className={Style.cartQuantityWrapper}>
          <button type="button" aria-label="Decrease quantity" className={Style.iconWrapper} onClick={() => dispatch(setQty({ productId: product._id, qty: qty - 1 }))} disabled={qty <= 1}>
            <FaMinus />
          </button>
          <div className={Style.quantity}>{qty}</div>
          <button type="button" aria-label="Increase quantity" className={Style.iconWrapper} onClick={() => dispatch(setQty({ productId: product._id, qty: qty + 1 }))} disabled={qty >= MAX_QTY}>
            <FaPlus />
          </button>
        </div>
      </div>
      <div className={Style.cartPrice}>
        <p>{formatPrice(price * qty)}</p>
        {qty > 1 && <small>{formatPrice(price)} each</small>}
      </div>
    </div>
  );
};

export default CartCard;
