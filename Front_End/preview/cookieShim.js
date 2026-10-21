// Preview-build stand-in for react-cookie: keeps the session in localStorage/memory because
// cookies can be blocked inside embedded pages.
import { useEffect, useState } from "react";
const KEY = "medisync_session_cookies";
const listeners = new Set();
let mem = {};
try { mem = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { /* ignore */ }
const commit = (next) => {
  mem = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
};
const setCookie = (name, value) => commit({ ...mem, [name]: value });
const removeCookie = (name) => { const { [name]: _drop, ...rest } = mem; commit(rest); };
export const useCookies = () => {
  const [, tick] = useState(0);
  useEffect(() => { const l = () => tick((n) => n + 1); listeners.add(l); return () => listeners.delete(l); }, []);
  return [mem, setCookie, removeCookie];
};
