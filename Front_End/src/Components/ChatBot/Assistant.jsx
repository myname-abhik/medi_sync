import React, { useEffect, useRef, useState } from "react";
import Style from "../../css/assistant.module.css";
import { GREETING, QUICK_REPLIES, assistantReply } from "../../data/assistant";

// Offline assistant: keyword-based answers from data/assistant.js (no AI service involved).
const Assistant = () => {
  const [messages, setMessages] = useState([{ from: "bot", text: GREETING }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef(null);
  const timer = useRef(null);

  useEffect(() => bottom.current?.scrollIntoView({ block: "end" }), [messages, busy]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const ask = (text) => {
    const q = text.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { from: "me", text: q }]);
    setDraft("");
    setBusy(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: assistantReply(q) }]);
      setBusy(false);
    }, 600);
  };

  return (
    <div className={Style.panel}>
      <div className={Style.head}>
        Medisync assistant
        <small>General information only, not medical advice</small>
      </div>
      <div className={Style.log} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`${Style.msg} ${m.from === "me" ? Style.me : Style.bot}`}>{m.text}</div>
        ))}
        {busy && <div className={`${Style.msg} ${Style.bot}`}>...</div>}
        <div ref={bottom} />
      </div>
      {messages.length === 1 && (
        <div className={Style.quick}>
          {QUICK_REPLIES.map((q) => (
            <button key={q} type="button" onClick={() => ask(q)}>{q}</button>
          ))}
        </div>
      )}
      <form className={Style.form} onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
        <input type="text" placeholder="Type your question..." value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Your question" />
        <button type="submit" disabled={!draft.trim() || busy}>Send</button>
      </form>
    </div>
  );
};

export default Assistant;
