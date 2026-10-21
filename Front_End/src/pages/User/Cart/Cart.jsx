import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Style from "../../../css/cart.module.css";
import CartCard from "./CartCard";
import { Button } from "../../../Components";
import { getCatalog } from "../../../services/catalog";
import { clearCart } from "../../../redux/features/cartSlice";
import { addNotification } from "../../../redux/features/notificationSlice";
import { formatPrice, getPricing } from "../../../utils/format";

// Demo promo codes (percentage off the subtotal).
const PROMOS = { MEDI10: 10, HEALTH20: 20 };

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [catalog, setCatalog] = useState([]);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null); // { code, pct }
  const [promoError, setPromoError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let alive = true;
    getCatalog().then((list) => alive && setCatalog(list));
    return () => {
      alive = false;
    };
  }, []);

  const lines = useMemo(
    () => items.map((i) => ({ product: catalog.find((p) => p._id === i.productId), qty: i.qty })).filter((l) => l.product),
    [items, catalog]
  );
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + getPricing(l.product).price * l.qty, 0);
  const discount = promo ? Math.round(subtotal * promo.pct) / 100 : 0;
  const total = subtotal - discount;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromo({ code, pct: PROMOS[code] });
      setPromoError("");
    } else {
      setPromo(null);
      setPromoError("That code isn't valid. Try MEDI10.");
    }
  };

  const checkout = () => {
    const id = `MS-${Date.now().toString().slice(-7)}`;
    setOrder({ id, total, count });
    dispatch(addNotification({ type: "order", title: `Order ${id} placed`, body: `${count} item${count === 1 ? "" : "s"} - ${formatPrice(total)}. We'll let you know when it ships.` }));
    dispatch(clearCart());
    setPromo(null);
    setPromoInput("");
  };

  if (order) {
    return (
      <section className={Style.cartContainer}>
        <div className={Style.stateBox}>
          <h2>Thank you! Your order is placed</h2>
          <p>Order <strong>{order.id}</strong> - {order.count} item{order.count === 1 ? "" : "s"} - {formatPrice(order.total)}</p>
          <p>This is a demo checkout, so no payment was taken.</p>
          <Button text="Keep shopping" link="/products" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={Style.cartContainer}>
        <div className={Style.stateBox}>
          <h2>Your cart is empty</h2>
          <p>Add medicines and health devices from the products page.</p>
          <Button text="Browse products" link="/products" />
          <Link to="/user/precriptions">Reorder from a prescription</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={Style.cartContainer}>
      <div className={Style.top}>
        <div className={Style.cartTitle}>
          <div className={Style.cartHeading}>Shopping Cart</div>
          <div className={Style.cartHeading}>{count} {count === 1 ? "Item" : "Items"}</div>
        </div>
        <div className={Style.cartDetailsTitle}>
          <p>Product Details</p>
          <p>Quantity</p>
          <p>Price</p>
        </div>
      </div>
      <div className={Style.bottom}>
        <div className={Style.left}>
          {lines.map((line) => (
            <CartCard key={line.product._id} item={line} />
          ))}
        </div>
        <div className={Style.right}>
          <div className={Style.orderSummary}>
            <h3>Order Summary</h3>
          </div>
          <div className={Style.promoCode}>
            <div className={Style.promoRow}>
              <input type="text" placeholder="Enter Promo Code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyPromo()} />
              <button type="button" onClick={applyPromo}>Apply</button>
            </div>
            {promoError && <p className={`${Style.promoMsg} ${Style.bad}`}>{promoError}</p>}
            {promo && <p className={`${Style.promoMsg} ${Style.good}`}>{promo.code} applied: {promo.pct}% off</p>}
          </div>
          <div className={Style.priceDetails}>
            <div className={Style.priceWrapper}>
              <p>Subtotal</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <div className={`${Style.priceWrapper} ${Style.discount}`}>
              <p>Discount</p>
              <p>- {formatPrice(discount)}</p>
            </div>
            <div className={`${Style.priceWrapper} ${Style.total}`}>
              <p>Total</p>
              <p>{formatPrice(total)}</p>
            </div>
          </div>
          <div className={Style.checkoutBtn} onClick={checkout} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && checkout()}>
            Buy Now
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
