"use client";
import { useEffect } from "react";

export default function HistoryListener() {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log("Popstate event triggered:", event);
      console.log("History length:", window.history.length);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return null;
}
