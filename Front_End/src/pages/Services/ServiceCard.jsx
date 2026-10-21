import React, { useState } from "react";
import Style from "../../css/service.module.css";
import { Button } from "../../Components";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setMeeting } from "../../redux/features/meetingSlice";
import { addNotification } from "../../redux/features/notificationSlice";
import { formatDateTime } from "../../utils/format";
import BookingModal from "./BookingModal";

const ServiceCard = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.userData?.user);
  const [booking, setBooking] = useState(false);
  const available = data.Doctor_available !== false;

  const start = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setBooking(true);
  };

  const confirm = (time) => {
    dispatch(
      setMeeting({
        time,
        img: data.doctor_Image,
        id: data._id,
        from: data.doctor_name,
        specialty: data.doctor_profile,
        to: user.name,
        code: uuidv4(),
      })
    );
    const { date, time: clock } = formatDateTime(time);
    dispatch(addNotification({ type: "meeting", title: `Meeting booked with ${data.doctor_name}`, body: `${date} at ${clock} (IST). Join from the Meetings page.` }));
    setBooking(false);
    navigate("/user/meetings");
  };

  return (
    <>
      <div className={Style.card}>
        <div className={Style.cardimg}>
          <img src={data.doctor_Image} alt={data.doctor_name} loading="lazy" />
        </div>
        <p className={Style.meeting}>{available ? "Meeting with" : "Currently unavailable"}</p>
        <h2 title={Array.isArray(data.doctor_degree) ? data.doctor_degree.join(", ") : undefined}>
          <strong>{data.doctor_name}</strong>
        </h2>
        <p className={Style.degree}>{data.doctor_profile}</p>
        <div>
          <Button text={available ? "Book meeting" : "Unavailable"} onClick={start} type="button" disabled={!available} newClass={available ? "" : Style.unavailable} />
        </div>
      </div>
      {booking && <BookingModal doctor={data} onClose={() => setBooking(false)} onConfirm={confirm} />}
    </>
  );
};

export default ServiceCard;
