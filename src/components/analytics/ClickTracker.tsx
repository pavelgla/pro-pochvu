"use client";

import { useEffect } from "react";
import {
  trackPhoneClick,
  trackTelegramClick,
  trackLeadFormSubmit,
  trackGoal,
  GOAL,
} from "@/lib/analytics";

/**
 * Document-level event delegation for analytics.
 *
 * One listener catches every click/submit anywhere in the app, so we don't
 * need to wrap each `<a href="tel:...">` or `<a href="https://t.me/...">`
 * with a tracking handler.
 *
 * Lead forms can opt in by adding `data-track-form="<form-id>"` to the
 * <form> element.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a") as HTMLAnchorElement | null;
      if (!link?.href) return;

      const href = link.href;

      if (href.startsWith("tel:")) {
        trackPhoneClick(href.replace(/^tel:/, ""));
        return;
      }
      if (/^https?:\/\/(t\.me|telegram\.me)\//.test(href)) {
        // Last path segment is a useful handle, e.g. "+7cAd9gatgP44MDcy".
        const handle = href.split("/").pop() || undefined;
        trackTelegramClick(handle);
        return;
      }
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
        trackGoal(GOAL.WHATSAPP_CLICK);
        return;
      }
    };

    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement | null;
      if (!form || form.tagName !== "FORM") return;
      const id = form.getAttribute("data-track-form");
      if (!id) return;
      trackLeadFormSubmit(id);
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, []);

  return null;
}
