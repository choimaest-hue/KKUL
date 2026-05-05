"use client";

import Image from "next/image";
import { useState } from "react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

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

      {/* 모달 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* 배경 딤 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* 모달 카드 */}
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
            {/* 닫기 버튼 */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="닫기"
            >
              ✕
            </button>

            {/* 헤더 */}
            <div className="text-center mb-6">
              <p className="text-4xl mb-1">🦜</p>
              <h2 style={{ fontFamily: "'Do Hyeon', sans-serif", fontSize: "1.3rem", color: "var(--navy)" }}>
                껄껄무새와 소통해요
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>
                서비스 개선 아이디어 · 버그 신고 · 따뜻한 응원
              </p>
            </div>

            {/* 문의 섹션 */}
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
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                <span style={{ fontSize: "1.2rem" }}>✉️</span>
                <span>choimaest@naver.com</span>
              </a>
            </div>

            {/* 후원 섹션 */}
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "16px 18px",
                border: "1px solid #f0f0f0",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", marginBottom: "8px", letterSpacing: "0.05em" }}>
                ☕ 개발자 커피 후원
              </p>
              <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "10px" }}>
                껄껄무새가 계속 울 수 있도록 커피 한 잔 사주세요 🙏
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Image
                  src="/toss-qr.png"
                  alt="토스 후원 QR코드"
                  width={180}
                  height={180}
                  style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}
                />
                <p style={{ fontSize: "0.75rem", color: "#888", margin: 0 }}>
                  📱 카메라로 스캔하면 바로 후원할 수 있어요
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
