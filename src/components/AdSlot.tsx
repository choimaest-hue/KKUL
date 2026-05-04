"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

type AdNetwork = "adsense" | "adfit";

type AdSlotProps = {
  network: AdNetwork;
  className?: string;
  slotId: string;
  adfitUnit?: string;
  adfitWidth?: number;
  adfitHeight?: number;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  network,
  className = "",
  slotId,
  adfitUnit,
  adfitWidth = 320,
  adfitHeight = 100,
}: AdSlotProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  const isConfigured = useMemo(() => {
    if (network === "adsense") {
      return Boolean(adsenseClient && slotId);
    }
    return Boolean(adfitUnit);
  }, [adfitUnit, adsenseClient, network, slotId]);

  useEffect(() => {
    if (!isConfigured || !hostRef.current) {
      return;
    }

    const host = hostRef.current;

    const updateVisibility = () => {
      const hasIframe = host.querySelector("iframe") !== null;
      const hasFilledAdsense =
        host.querySelector("ins[data-ad-status='filled']") !== null;
      setIsVisible(hasIframe || hasFilledAdsense);
    };

    const observer = new MutationObserver(updateVisibility);
    observer.observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    const timer = window.setTimeout(updateVisibility, 3500);
    updateVisibility();

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [isConfigured]);

  useEffect(() => {
    if (!isConfigured || network !== "adsense") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore ad script failures and keep slot hidden by observer logic.
    }
  }, [isConfigured, network, slotId]);

  if (!isConfigured) {
    return null;
  }

  return (
    <div
      ref={hostRef}
      className={`transition-all duration-300 ${
        isVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      } ${className}`}
      aria-hidden={!isVisible}
    >
      {network === "adsense" ? (
        <>
          <Script
            id="adsense-lib"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adsenseClient}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </>
      ) : (
        <>
          <Script
            id="adfit-lib"
            strategy="afterInteractive"
            src="https://t1.daumcdn.net/kas/static/ba.min.js"
            async
          />
          <ins
            className="kakao_ad_area"
            style={{ display: "none" }}
            data-ad-unit={adfitUnit}
            data-ad-width={String(adfitWidth)}
            data-ad-height={String(adfitHeight)}
          />
        </>
      )}
    </div>
  );
}
