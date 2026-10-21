import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingBag, FaVideo, FaTag, FaInfoCircle } from "react-icons/fa";
import Style from "../../../css/notifications.module.css";
import Common from "../../../css/common.module.css";
import { markRead, markAllRead, removeNotification, clearNotifications } from "../../../redux/features/notificationSlice";
import { timeAgo } from "../../../utils/format";

const ICONS = { order: <FaShoppingBag />, meeting: <FaVideo />, offer: <FaTag />, info: <FaInfoCircle /> };

const Notifications = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.notifications.items);
  const unread = items.filter((n) => !n.read).length;

  return (
    <section className={Common.page}>
      <div className={Common.pageHeader}>
        <div>
          <h1 className={Common.pageTitle}>Notifications</h1>
          <p className={Common.pageSub}>{unread ? `${unread} unread` : "You're all caught up"}</p>
        </div>
        <div className={Common.actions}>
          <button type="button" className={Common.ghostBtn} onClick={() => dispatch(markAllRead())} disabled={unread === 0}>
            Mark all as read
          </button>
          <button type="button" className={`${Common.ghostBtn} ${Common.dangerBtn}`} onClick={() => dispatch(clearNotifications())} disabled={items.length === 0}>
            Clear all
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={Common.empty}>
          <h2>No notifications</h2>
          <p>Order updates and meeting reminders will show up here.</p>
        </div>
      ) : (
        <ul className={Style.list}>
          {items.map((n) => (
            <li key={n.id} className={`${Style.item} ${n.read ? "" : Style.unread}`} onClick={() => dispatch(markRead(n.id))}>
              <div className={Style.icon}>{ICONS[n.type] || ICONS.info}</div>
              <div className={Style.text}>
                <div className={Style.title}>{n.title}</div>
                <div className={Style.body}>{n.body}</div>
                <div className={Style.time}>{timeAgo(n.time)}</div>
              </div>
              <button type="button" className={Style.dismiss} aria-label="Dismiss notification" onClick={(e) => { e.stopPropagation(); dispatch(removeNotification(n.id)); }}>
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Notifications;
