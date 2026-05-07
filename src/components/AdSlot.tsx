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
  const [status, setStatus] = useState<"pending" | "visible" | "empty">("pending");

  useEffect(() => {
    if (!unit || !hostRef.current) return;
    const host = hostRef.current;
    let resolved = false;

    setStatus("pending");

    const check = () => {
      const iframe = host.querySelector("iframe");
      if (!iframe) return false;

      resolved = true;
      setStatus("visible");
      return true;
    };

    const ob = new MutationObserver(check);
    ob.observe(host, { childList: true, subtree: true });
    const checkTimer = window.setTimeout(check, 4500);
    const emptyTimer = window.setTimeout(() => {
      if (resolved || check()) return;
      ob.disconnect();
      setStatus("empty");
    }, 7000);

    return () => {
      ob.disconnect();
      clearTimeout(checkTimer);
      clearTimeout(emptyTimer);
    };
  }, [unit, width, height]);

  if (!unit || status === "empty") return null;

  const visible = status === "visible";

  return (
    <div
      ref={hostRef}
      className={`overflow-hidden transition-all duration-500 ${
        visible ? `opacity-100 ${className}` : "opacity-0"
      }`}
      style={{ maxHeight: visible ? height + 48 : 0, maxWidth: "100%" }}
      aria-hidden={!visible}
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
