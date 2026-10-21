import React, { useEffect, useState } from "react";
import Style from "../../css/modal.module.css";
import Common from "../../css/common.module.css";
import { Button } from "../../Components";

const pad = (n) => String(n).padStart(2, "0");
const toLocalInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

const BookingModal = ({ doctor, onClose, onConfirm }) => {
  const earliest = new Date(Date.now() + 60 * 60 * 1000);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const [when, setWhen] = useState(toLocalInput(tomorrow));
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const date = new Date(when);
    if (Number.isNaN(date.getTime()) || date < earliest) {
      setError("Choose a time at least one hour from now.");
      return;
    }
    onConfirm(date.toISOString());
  };

  return (
    <div className={Style.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className={Style.modal} onSubmit={submit} role="dialog" aria-modal="true" aria-label={`Book ${doctor.doctor_name}`}>
        <div className={Style.header}>
          <img src={doctor.doctor_Image} alt="" />
          <div>
            <h3>{doctor.doctor_name}</h3>
            <p>{doctor.doctor_profile}</p>
          </div>
        </div>
        <label className={Style.label} htmlFor="meeting-time">Pick a date and time</label>
        <input id="meeting-time" className={Style.input} type="datetime-local" required min={toLocalInput(earliest)} value={when} onChange={(e) => { setWhen(e.target.value); setError(""); }} />
        <p className={Style.note}>Your meeting appears under Meetings, where you can join the video call.</p>
        {error && <p className={Style.error} role="alert">{error}</p>}
        <div className={Style.footer}>
          <button type="button" className={Common.ghostBtn} onClick={onClose}>Cancel</button>
          <Button text="Book meeting" type="button" />
        </div>
      </form>
    </div>
  );
};

export default BookingModal;
