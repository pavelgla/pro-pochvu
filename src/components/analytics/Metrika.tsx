"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Yandex Metrika loader.
 *
 * Strict consent mode: the Metrika script is NOT loaded until the user picks
 * a cookie option. After "essential" — counter loads without webvisor/clickmap
 * (only pageviews + reachGoal). After "all" — webvisor + clickmap enabled.
 *
 * Listens to a custom `cookie-consent-changed` window event so the
 * <CookieBanner /> can flip consent at runtime without a full reload.
 *
 * Counter ID comes from NEXT_PUBLIC_METRIKA_ID, baked at build time
 * via the Docker build-arg.
 */

const COUNTER_ID_RAW = process.env.NEXT_PUBLIC_METRIKA_ID;

type Consent = "all" | "essential" | null;

function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem("cookie-consent");
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function Metrika() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    setConsent(readConsent());
    const handler = () => setConsent(readConsent());
    window.addEventListener("cookie-consent-changed", handler);
    return () => window.removeEventListener("cookie-consent-changed", handler);
  }, []);

  if (!COUNTER_ID_RAW) return null;
  const counterId = Number(COUNTER_ID_RAW);
  if (!Number.isFinite(counterId) || counterId <= 0) return null;
  if (!consent) return null;

  const webvisor = consent === "all";

  // The init script is the canonical Metrika snippet, parameterized for
  // counter ID and webvisor/clickmap based on consent.
  const initCode = `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(${counterId}, "init", {
  clickmap: ${webvisor ? "true" : "false"},
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: ${webvisor ? "true" : "false"},
  ecommerce: "dataLayer"
});
  `.trim();

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initCode }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
