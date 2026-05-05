"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type AdSlotProps = {
  unit: string;
  width: number;
  height: number;
  className?: string;
};

export default function AdSlot({ unit, width, height, className = "" }: AdSlotProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!unit || !hostRef.current) return;
    const host = hostRef.current;
    const check = () => {
      setVisible(host.querySelector("iframe") !== null);
    };
    const ob = new MutationObserver(check);
    ob.observe(host, { childList: true, subtree: true });
    const t = window.setTimeout(check, 4500);
    return () => {
      ob.disconnect();
      clearTimeout(t);
    };
  }, [unit]);

  if (!unit) return null;

  return (
    <div
      ref={hostRef}
      className={`transition-all duration-500 overflow-hidden ${
        visible ? "opacity-100" : "max-h-0 opacity-0"
      } ${className}`}
    >
      <Script
        id="adfit-lib"
        strategy="afterInteractive"
        src="https://t1.daumcdn.net/kas/static/ba.min.js"
      />
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={unit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  );
}
