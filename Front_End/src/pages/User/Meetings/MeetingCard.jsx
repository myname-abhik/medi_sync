import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Style from "../../../css/meeting.module.css";
import { Button } from "../../../Components";
import { removeMeeting } from "../../../redux/features/meetingSlice";
import { formatDateTime } from "../../../utils/format";

const MeetingCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { date, time } = formatDateTime(data.time);

  return (
    <div className={Style.meetingCard}>
      <div className={Style.meetingImg}>
        <img className={Style.img} src={data.img} alt={data.from} />
      </div>
      <p>meeting With</p>
      <p className={Style.name}>{data.from}</p>
      <p className={Style.meetingTime}>Meeting Date:- <b>{date}</b></p>
      <p className={Style.meetingTime}>Meeting Time:- <b>{time} (IST)</b></p>
      <div className={Style.buttonSection}>
        <Button text="Join Now" onClick={() => navigate(`/room/${data.code}`)} type="button" />
        <button type="button" className={Style.cancelBtn} onClick={() => window.confirm(`Cancel your meeting with ${data.from}?`) && dispatch(removeMeeting(data.code))}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MeetingCard;
