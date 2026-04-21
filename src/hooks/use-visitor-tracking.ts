import { useEffect, useRef } from "react";
import { api } from "@/lib/api";

function getSessionId(): string {
  const key = "portfolio_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function isAlreadyTracked(componentName: string): boolean {
  const tracked = JSON.parse(
    sessionStorage.getItem("portfolio_tracked") || "[]"
  ) as string[];
  return tracked.includes(componentName);
}

function markAsTracked(componentName: string) {
  const tracked = JSON.parse(
    sessionStorage.getItem("portfolio_tracked") || "[]"
  ) as string[];
  if (!tracked.includes(componentName)) {
    tracked.push(componentName);
    sessionStorage.setItem("portfolio_tracked", JSON.stringify(tracked));
  }
}

/**
 * Tracks a visitor view once per session for the given component name.
 * Attach the returned ref to the root element of the section.
 */
export function useVisitorTracking(componentName: string) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isAlreadyTracked(componentName)) {
            const sessionId = getSessionId();
            api
              .recordVisit({ component_name: componentName, session_id: sessionId })
              .catch(() => {});
            markAsTracked(componentName);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [componentName]);

  return ref;
}
