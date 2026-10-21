import React from "react";
import Style from "../../../css/meeting.module.css";
import Common from "../../../css/common.module.css";
import MeetingCard from "./MeetingCard";
import { useSelector } from "react-redux";
import { Button } from "../../../Components";

const Meetings = () => {
  const meetings = useSelector((state) => state.meet.meeting);

  return (
    <>
      <div className={Style.pageHead}>
        <h1>Your meetings</h1>
        <p>{meetings.length ? "Join your video consultation at the scheduled time." : "Nothing scheduled yet."}</p>
      </div>
      {meetings.length === 0 ? (
        <div className={Common.empty}>
          <h2>No meetings booked</h2>
          <p>Pick a doctor and choose a time that suits you.</p>
          <Button text="Find a doctor" link="/services" />
        </div>
      ) : (
        <section className={Style.meetingContainer}>
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.code} data={meeting} />
          ))}
        </section>
      )}
    </>
  );
};

export default Meetings;
