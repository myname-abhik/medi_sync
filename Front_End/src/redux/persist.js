// Cart, meetings and notifications are stored per user in localStorage so they survive a refresh.
import { read, write } from "../services/storage";
import { seedNotifications } from "../data/notifications";
import { hydrateCart } from "./features/cartSlice";
import { hydrateMeetings } from "./features/meetingSlice";
import { hydrateNotifications } from "./features/notificationSlice";

const key = (name, userId) => `medisync_${name}_${userId}`;

export const hydrateUserData = (dispatch, user) => {
  const id = user._id;
  dispatch(hydrateCart({ owner: id, items: read(key("cart", id), []) }));
  dispatch(hydrateMeetings({ owner: id, meetings: read(key("meetings", id), []) }));
  dispatch(hydrateNotifications({ owner: id, items: read(key("notifications", id), null) ?? seedNotifications(user.name) }));
};

export const attachPersistence = (store) => {
  const last = {};
  const save = (name, owner, userId, value) => {
    // Only write data that has been loaded for the logged-in user, and only when it changed.
    if (owner !== userId || last[name] === value) return;
    last[name] = value;
    write(key(name, userId), value);
  };
  store.subscribe(() => {
    const s = store.getState();
    const userId = s.user.userData?.user?._id;
    if (!userId) return;
    save("cart", s.cart.owner, userId, s.cart.items);
    save("meetings", s.meet.owner, userId, s.meet.meeting);
    save("notifications", s.notifications.owner, userId, s.notifications.items);
  });
};
