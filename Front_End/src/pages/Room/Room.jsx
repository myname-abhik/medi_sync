import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import Style from "../../css/room.module.css";
import doctorPlaceholder from "../../assets/Profile-Doctor.png";
import { FORCE_STATIC, ZEGO_APP_ID, ZEGO_SERVER_SECRET } from "../../config";

const pad = (n) => String(n).padStart(2, "0");

// Offline room: a simulated call screen (no camera, microphone or third-party service needed).
const StaticRoom = ({ meeting, user, onLeave }) => {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={Style.call}>
      <div className={Style.stage}>
        <img className={Style.remote} src={meeting?.img || doctorPlaceholder} alt={meeting?.from || "Doctor"} />
        <div className={Style.timer}>{pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}</div>
        <div className={Style.nameTag}>{meeting?.from || "Your doctor"}{!mic && " (you are muted)"}</div>
        <div className={Style.self}>
          {cam ? <img src={user?.Image || "/images/avatar.svg"} alt="You" /> : <FaVideoSlash />}
          <span>You</span>
        </div>
      </div>
      <div className={Style.controls}>
        <button type="button" className={`${Style.ctrl} ${mic ? "" : Style.off}`} onClick={() => setMic(!mic)} aria-label={mic ? "Mute microphone" : "Unmute microphone"}>
          {mic ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button type="button" className={`${Style.ctrl} ${cam ? "" : Style.off}`} onClick={() => setCam(!cam)} aria-label={cam ? "Turn camera off" : "Turn camera on"}>
          {cam ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button type="button" className={`${Style.ctrl} ${Style.end}`} onClick={onLeave} aria-label="Leave call">
          <FaPhoneSlash />
        </button>
      </div>
      <p className={Style.callNote}>Demo room: audio and video are simulated. Connect ZegoCloud (see README) for real calls.</p>
    </div>
  );
};

// Live room powered by ZegoCloud. The SDK is only downloaded when this mode is used.
const ZegoRoom = ({ roomId, user }) => {
  const container = useRef(null);

  useEffect(() => {
    let zc;
    let cancelled = false;
    (async () => {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      if (cancelled || !container.current) return;
      // NOTE: generateKitTokenForTest is for development only. Generate tokens on a server in production.
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(ZEGO_APP_ID, ZEGO_SERVER_SECRET, roomId, user?._id || Date.now().toString(), user?.name || "Guest");
      zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: container.current,
        sharedLinks: [{ name: "Copy Link", url: `${window.location.origin}/room/${roomId}` }],
        scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
        showScreenSharingButton: true,
      });
    })();
    return () => {
      cancelled = true;
      zc?.destroy?.();
    };
  }, [roomId, user?._id, user?.name]);

  return <div ref={container} style={{ minHeight: "70vh" }} />;
};

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData?.user);
  const meeting = useSelector((state) => state.meet.meeting.find((m) => m.code === roomId));
  const leave = () => navigate("/user/meetings");

  // Real video calls when ZegoCloud keys are configured, otherwise the simulated call screen.
  const live = !FORCE_STATIC && ZEGO_APP_ID && ZEGO_SERVER_SECRET;

  return (
    <div className={Style.room}>
      {live ? <ZegoRoom roomId={roomId} user={user} /> : <StaticRoom meeting={meeting} user={user} onLeave={leave} />}
    </div>
  );
};

export default Room;
