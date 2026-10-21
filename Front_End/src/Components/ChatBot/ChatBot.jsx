import React, { useEffect, useRef, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import Style from "../../css/chatbot.module.css";
import Assistant from "./Assistant";
import { CHATBASE_ID, FORCE_STATIC } from "../../config";

// The built-in offline assistant is shown unless a VITE_CHATBASE_ID is configured
// (and VITE_USE_STATIC is not "true"), in which case the Chatbase iframe is used.
const useIframe = !FORCE_STATIC && !!CHATBASE_ID;

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const openFromElsewhere = () => setOpen(true);
    document.addEventListener("mousedown", handler);
    window.addEventListener("medisync:open-assistant", openFromElsewhere);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("medisync:open-assistant", openFromElsewhere);
    };
  }, []);

  return (
    <div className={Style.chatBot} ref={menuRef}>
      <div className={Style.chatWrapper} onClick={() => setOpen((o) => !o)} role="button" aria-label="Open health assistant" aria-expanded={open}>
        <IoChatbubbleEllipses className={Style.icon} />
      </div>
      <div className={`${Style.dropDownMenu} ${useIframe ? Style.withFrame : ""} ${open ? Style.active : Style.inactive}`}>
        {useIframe ? (
          <iframe src={`https://www.chatbase.co/chatbot-iframe/${CHATBASE_ID}`} title="Chatbot" width="100%" className={Style.frame} frameBorder="0"></iframe>
        ) : (
          open && <Assistant />
        )}
      </div>
    </div>
  );
};

export default ChatBot;
