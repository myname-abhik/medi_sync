import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, FORCE_API, FORCE_STATIC } from "../config";

// Is the backend usable right now? "Usable" = reachable AND its database is connected.
// The answer is cached briefly so a backend started later is picked up without a restart.
const TTL_MS = 10000;
let cache = null; // { value, at }
let inflight = null;
let lastLogged;

const log = (value) => {
  if (value === lastLogged) return;
  lastLogged = value;
  console.info(value ? "Medisync: backend reachable - using the API." : "Medisync: backend not available - using built-in static data.");
};

export const checkApi = () => {
  if (FORCE_STATIC) return Promise.resolve(false);
  if (FORCE_API) return Promise.resolve(true);
  if (cache && Date.now() - cache.at < TTL_MS) return Promise.resolve(cache.value);
  if (!inflight) {
    inflight = axios
      .get(API_URL, { timeout: 2000 })
      .then((res) => res.status === 200 && res.data?.db !== false)
      .catch(() => false)
      .then((value) => {
        cache = { value, at: Date.now() };
        inflight = null;
        log(value);
        return value;
      });
  }
  return inflight;
};

// Forget the cached answer (used after a failed API call so the next check is fresh).
export const resetApiCheck = () => {
  cache = null;
};

// null while checking, then true / false
export const useApiAvailable = () => {
  const [available, setAvailable] = useState(null);
  useEffect(() => {
    let alive = true;
    checkApi().then((v) => alive && setAvailable(v));
    return () => {
      alive = false;
    };
  }, []);
  return available;
};
