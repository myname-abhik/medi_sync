import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Style from "../../../css/chats.module.css";
import ChatButton from "./ChatButton";
import doctors from "../../../data/doctors";
import { chatContacts, seedChats, cannedReply } from "../../../data/chats";
import { read, write } from "../../../services/storage";
import { clockTime } from "../../../utils/format";

// Conversations are simulated locally: the doctor answers with a short canned reply.
const contacts = chatContacts.map((id) => doctors.find((d) => d._id === id)).filter(Boolean);

const Chats = () => {
  const userId = useSelector((state) => state.user.userData?.user?._id);
  const storageKey = `medisync_chats_${userId}`;
  const [chats, setChats] = useState(() => read(storageKey, null) ?? seedChats());
  const [activeId, setActiveId] = useState(contacts[0]?._id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => write(storageKey, chats), [chats, storageKey]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => bottomRef.current?.scrollIntoView({ block: "end" }), [chats, activeId, typing]);

  const active = contacts.find((d) => d._id === activeId);
  const messages = chats[activeId] || [];
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((d) => !q || d.doctor_name.toLowerCase().includes(q) || d.doctor_profile.toLowerCase().includes(q));
  }, [search]);

  const push = (id, msg) => setChats((c) => ({ ...c, [id]: [...(c[id] || []), msg] }));

  const send = () => {
    const text = draft.trim();
    if (!text || !activeId) return;
    const to = activeId;
    push(to, { id: `m${Date.now()}`, from: "me", text, time: new Date().toISOString() });
    setDraft("");
    setTyping(true);
    const count = (chats[to] || []).filter((m) => m.from === "me").length;
    timers.current.push(
      setTimeout(() => {
        push(to, { id: `m${Date.now()}r`, from: "doctor", text: cannedReply(text, count), time: new Date().toISOString() });
        setTyping(false);
      }, 1200)
    );
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section className={Style.chatsSection}>
      <div className={Style.left}>
        <div className={Style.searchWrapper}>
          <input className={Style.search} type="text" placeholder="Search Docs" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className={Style.searchIcon} aria-label="Search">
            <FaSearch />
          </button>
        </div>
        <div className={Style.chatsContainer}>
          {visible.map((d) => (
            <ChatButton key={d._id} doctor={d} last={(chats[d._id] || []).at(-1)} active={d._id === activeId} onClick={() => setActiveId(d._id)} />
          ))}
          {visible.length === 0 && <div className={Style.noResults}>No doctors match &quot;{search}&quot;</div>}
        </div>
      </div>
      {active && (
        <div className={Style.right}>
          <div className={Style.header}>
            <div className={Style.imgWrapper}>
              <img className={Style.img} src={active.doctor_Image} alt={active.doctor_name} />
            </div>
            <div className={Style.chatName}>{active.doctor_name}</div>
          </div>
          <div className={Style.body}>
            <div className={Style.chat}>
              {messages.map((m) => (
                <div key={m.id} className={`${Style.message} ${m.from === "me" ? Style.user : Style.client}`}>
                  <div className={Style.messageContent}>
                    <p className={Style.messageText}>{m.text}</p>
                    <span className={Style.messageTime}>{clockTime(m.time)}</span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            {typing && <div className={Style.typing}>{active.doctor_name} is typing...</div>}
            <div className={Style.chatInputWrapper}>
              <textarea className={Style.input} placeholder="Message" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} aria-label="Message"></textarea>
              <button type="button" className={Style.sendBtn} onClick={send} aria-label="Send message" disabled={!draft.trim()}>
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Chats;
