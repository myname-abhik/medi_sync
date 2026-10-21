import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Style from "../../../css/prescriptions.module.css";
import Common from "../../../css/common.module.css";
import { Button } from "../../../Components";
import prescriptions from "../../../data/prescriptions";
import doctors from "../../../data/doctors";
import { getCatalog } from "../../../services/catalog";
import { addItem } from "../../../redux/features/cartSlice";
import { formatDateTime, formatPrice, getPricing } from "../../../utils/format";

const Precriptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let alive = true;
    getCatalog().then((list) => alive && setCatalog(list));
    return () => {
      alive = false;
    };
  }, []);

  const reorder = (rx) => {
    rx.items.forEach((i) => dispatch(addItem({ productId: i.productId })));
    navigate("/user/cart");
  };

  return (
    <section className={Common.page}>
      <div className={Common.pageHeader}>
        <div>
          <h1 className={Common.pageTitle}>Prescriptions</h1>
          <p className={Common.pageSub}>Medicines your doctors recommended. Reorder them in one click.</p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className={Common.empty}>
          <h2>No prescriptions yet</h2>
          <p>After a consultation, your doctor&apos;s recommendations appear here.</p>
          <Button text="Find a doctor" link="/services" />
        </div>
      ) : (
        <div className={Style.list}>
          {prescriptions.map((rx) => {
            const doctor = doctors.find((d) => d._id === rx.doctorId);
            const rows = rx.items.map((i) => ({ ...i, product: catalog.find((p) => p._id === i.productId) })).filter((r) => r.product);
            const total = rows.reduce((sum, r) => sum + getPricing(r.product).price, 0);
            return (
              <article key={rx.id} className={Style.card}>
                <div className={Style.head}>
                  {doctor && <img src={doctor.doctor_Image} alt="" />}
                  <div className={Style.who}>
                    <div className={Style.doctor}>{doctor?.doctor_name || "Your doctor"}</div>
                    <div className={Style.meta}>{doctor?.doctor_profile} - {formatDateTime(rx.date).date} - Rx {rx.id.replace("rx-", "#")}</div>
                  </div>
                </div>
                <div className={Style.diagnosis}>{rx.diagnosis}</div>
                <div className={Style.notes}>{rx.notes}</div>
                <div className={Style.items}>
                  {rows.map((r) => (
                    <div key={r.productId} className={Style.row}>
                      <img src={r.product.Product_Image} alt="" />
                      <div className={Style.rowText}>
                        <div className={Style.rowTitle}>{r.product.Product_Title}</div>
                        <div className={Style.rowSub}>{r.dosage} - {r.duration}</div>
                      </div>
                      <div className={Style.rowPrice}>{formatPrice(getPricing(r.product).price)}</div>
                    </div>
                  ))}
                </div>
                <div className={Style.foot}>
                  <div className={Style.total}>Total {formatPrice(total)}</div>
                  <Button text="Reorder all" type="button" onClick={() => reorder(rx)} disabled={rows.length === 0} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Precriptions;
