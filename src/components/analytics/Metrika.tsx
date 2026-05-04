import Script from "next/script";

/**
 * Yandex Metrika loader.
 *
 * Soft mode: the counter loads on every page view, with webvisor + clickmap
 * always on. The cookie banner is informational and does not gate analytics —
 * this matches typical practice on Russian sites and avoids losing visitor
 * data when the user ignores the banner.
 *
 * Counter ID comes from NEXT_PUBLIC_METRIKA_ID, baked at build time via the
 * Docker build-arg. If the env var is empty/invalid, the component renders
 * nothing (e.g. for local dev without Metrika configured).
 */

const COUNTER_ID_RAW = process.env.NEXT_PUBLIC_METRIKA_ID;

export function Metrika() {
  if (!COUNTER_ID_RAW) return null;
  const counterId = Number(COUNTER_ID_RAW);
  if (!Number.isFinite(counterId) || counterId <= 0) return null;

  // Canonical Metrika init snippet, parameterized only by counter id.
  const initCode = `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(${counterId}, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
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
