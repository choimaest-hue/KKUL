"use client";

import Image from "next/image";
import { useState } from "react";

const BANK = "웰컴저축은행";
const ACCOUNT = "06601213519539";
const HOLDER = "최**";
const TOSS_LINK = `supertoss://send?bank=${encodeURIComponent(BANK)}&accountNo=${ACCOUNT}`;

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(ACCOUNT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="문의 및 후원"
        className="contact-fab animate-bob"
      >
        <Image src="/mascot-owl.svg" alt="" width={42} height={42} priority={false} />
        <span className="contact-fab-tooltip" aria-hidden="true">
          문의/후원
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card-bg)",
              color: "var(--ink)",
              borderRadius: "8px 8px 0 0",
              maxWidth: "440px",
              width: "100%",
              padding: "28px 24px 36px",
              position: "relative",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
            }}
            className="sm:mb-0 sm:rounded-lg"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="닫기"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <p className="text-4xl mb-1">🦜</p>
              <h2 style={{ fontFamily: "'Do Hyeon', sans-serif", fontSize: "1.3rem", color: "var(--navy)" }}>
                껄껄무새와 소통해요
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>
                서비스 개선 아이디어 · 버그 신고 · 따뜻한 응원
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "16px 18px",
                marginBottom: "14px",
                border: "1px solid #f0f0f0",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", marginBottom: "8px", letterSpacing: "0.05em" }}>
                📬 문의하기
              </p>
              <a
                href="mailto:choimaest@naver.com?subject=껄껄무새%20문의&body=안녕하세요!%20문의사항을%20남겨주세요."
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "var(--teal)",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "11px 16px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>✉️</span>
                <span>choimaest@naver.com</span>
              </a>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "16px 18px",
                border: "1px solid #f0f0f0",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", marginBottom: "10px", letterSpacing: "0.05em" }}>
                ☕ 개발자 커피 후원
              </p>

              <div
                style={{
                  background: "var(--yellow-l)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "10px",
                  border: "1px dashed var(--teal)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.78rem", color: "#888" }}>{BANK}</span>
                  <span style={{ fontSize: "0.78rem", color: "#888" }}>예금주: {HOLDER}</span>
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)", letterSpacing: "0.06em" }}>
                  {ACCOUNT}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                <a
                  href={TOSS_LINK}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "#3182f6",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "11px 8px",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                >
                  <span>💙</span>
                  <span>토스로 송금</span>
                </a>
                <button
                  onClick={handleCopy}
                  style={{
                    flex: 1,
                    background: copied ? "#22c55e" : "var(--yellow)",
                    color: "var(--ink)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "11px 8px",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {copied ? "✅ 복사됐어요!" : "📋 계좌 복사"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Image
                  src="/toss-qr.png"
                  alt="토스 송금 QR코드"
                  width={160}
                  height={160}
                  style={{ borderRadius: "6px", border: "1px solid #e0e0e0" }}
                />
                <p style={{ fontSize: "0.72rem", color: "#aaa", margin: 0 }}>
                  📱 토스 앱으로 스캔하면 바로 송금돼요
                </p>
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#bbb", marginTop: "16px" }}>
              껄껄~ 작은 후원이 큰 힘이 됩니다 🦜
            </p>
          </div>
        </div>
      )}
    </>
  );
}
