import React from "react";
import Style from "../../../css/chats.module.css";
import { clockTime } from "../../../utils/format";

const ChatButton = ({ doctor, last, active, onClick }) => (
  <div className={`${Style.chatsWrapper} ${active ? Style.activeChat : ""}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()}>
    <div className={Style.imgWrapper}>
      <img className={Style.img} src={doctor.doctor_Image} alt={doctor.doctor_name} />
    </div>
    <div className={Style.chatInfo}>
      <div className={Style.chatName}>{doctor.doctor_name}</div>
      <div className={Style.chatMsg}>{last ? (last.from === "me" ? `You: ${last.text}` : last.text) : doctor.doctor_profile}</div>
    </div>
    {last && <div className={Style.chatTime}>{clockTime(last.time)}</div>}
  </div>
);

export default ChatButton;
