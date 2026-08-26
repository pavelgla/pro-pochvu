"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { shouldShowConomniWidget } from "@/lib/widget";

const BASE_URL = "https://conomni.ru";

export default function ConomniWidget() {
  // Read the token inside the component, not as a module constant: a module
  // constant is captured once at import time.
  const token = process.env.NEXT_PUBLIC_CONOMNI_WIDGET_TOKEN ?? "";
  const pathname = usePathname() ?? "";

  if (!shouldShowConomniWidget(pathname, token)) return null;

  return (
    <Script id="conomni-widget" strategy="afterInteractive">{`
      (function(d,t){
        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src="${BASE_URL}/packs/js/sdk.js"; g.async=true;
        s.parentNode.insertBefore(g,s);
        g.onload=function(){ window.chatwootSDK.run({ websiteToken: "${token}", baseUrl: "${BASE_URL}" }); };
      })(document,"script");
    `}</Script>
  );
}
