"use client";
import { useSyncExternalStore } from "react";
import { site } from "@/data/site";

// Ticks once per minute, aligned to the minute boundary.
function subscribe(onTick: () => void) {
  let interval: ReturnType<typeof setInterval> | undefined;
  const timeout = setTimeout(
    () => {
      onTick();
      interval = setInterval(onTick, 60_000);
    },
    60_000 - (Date.now() % 60_000),
  );
  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
}

function formatNow() {
  try {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: site.timeZone,
    })
      .format(new Date())
      .toLowerCase();
  } catch {
    return ""; // Invalid time zone: hide the line rather than mislead.
  }
}

/**
 * "Based in {city} · {time} here". Renders nothing until both `site.city`
 * and `site.timeZone` are set, and nothing during static rendering (the
 * server snapshot is empty), so there is no hydration mismatch.
 */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, formatNow, () => "");
  if (!site.city || !site.timeZone || !time) return null;
  return (
    <p className="local-time">
      Based in {site.city} · <time>{time}</time> here
    </p>
  );
}
