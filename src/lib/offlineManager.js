import { useState, useEffect } from "react";

const CASES_STORAGE_KEY = "sentinel_id_offline_cases";
const SYNTHETIC_DOCS_STORAGE_KEY = "sentinel_id_offline_synthetic_docs";
const OFFLINE_MODE_PREF_KEY = "sentinel_id_force_offline";

// Helpers for localStorage persistence
export function getStoredCases(fallback = []) {
  try {
    const data = localStorage.getItem(CASES_STORAGE_KEY);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn("Error reading stored cases:", err);
    return fallback;
  }
}

export function setStoredCases(cases) {
  try {
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.warn("Error writing stored cases:", err);
  }
}

export function getStoredSyntheticDocs(fallback = []) {
  try {
    const data = localStorage.getItem(SYNTHETIC_DOCS_STORAGE_KEY);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn("Error reading stored synthetic docs:", err);
    return fallback;
  }
}

export function setStoredSyntheticDocs(docs) {
  try {
    localStorage.setItem(SYNTHETIC_DOCS_STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.warn("Error writing stored synthetic docs:", err);
  }
}

export function isForceOffline() {
  try {
    return localStorage.getItem(OFFLINE_MODE_PREF_KEY) === "true";
  } catch {
    return false;
  }
}

export function setForceOffline(val) {
  try {
    localStorage.setItem(OFFLINE_MODE_PREF_KEY, String(val));
    window.dispatchEvent(new Event("storage_offline_mode_changed"));
  } catch (err) {
    console.warn("Error toggling offline mode:", err);
  }
}

export function useOfflineManager() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== "undefined" ? navigator.onLine : true);
  const [forceOffline, setForceOfflineState] = useState(() => isForceOffline());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handlePrefChange = () => setForceOfflineState(isForceOffline());

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("storage_offline_mode_changed", handlePrefChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("storage_offline_mode_changed", handlePrefChange);
    };
  }, []);

  const toggleForceOffline = () => {
    const nextVal = !forceOffline;
    setForceOffline(nextVal);
    setForceOfflineState(nextVal);
  };

  const effectiveOffline = !isOnline || forceOffline;

  return {
    isOnline,
    forceOffline,
    effectiveOffline,
    toggleForceOffline
  };
}
