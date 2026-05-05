"use client";

import { useState } from "react";

const STEPS = [
  {
    num: "1",
    title: "매도한 종목 입력",
    desc: "팔았던 종목, 판 날짜, 수량을 입력하세요. 검색창에 종목명·코드를 치면 자동완성이 뜹니다.",
    preview: (
      <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px", fontSize: "0.78rem" }}>
        <div style={{ fontWeight: 800, color: "#64748B", marginBottom: "8px", fontSize: "0.72rem", letterSpacing: "0.05em" }}>
          <span style={{ background: "#070A12", color: "#fff", borderRadius: "999px", padding: "2px 8px", marginRight: "6px", fontSize: "0.68rem" }}>1</span>
          매도 정보
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
          <div style={{ background: "#fff", borderRadius: "6px", padding: "7px 9px", border: "1.5px solid #CBD5E1" }}>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: "3px" }}>매도 종목</div>
            <div style={{ fontWeight: 800, color: "#070A12" }}>TSLA</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "6px", padding: "7px 9px", border: "1.5px solid #CBD5E1" }}>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: "3px" }}>매도일</div>
            <div style={{ fontWeight: 700, color: "#070A12" }}>2024-01-15</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "6px", padding: "7px 9px", border: "1.5px solid #CBD5E1" }}>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: "3px" }}>수량</div>
            <div style={{ fontWeight: 700, color: "#070A12" }}>10주</div>
          </div>
        </div>
        <div style={{ marginTop: "8px", fontSize: "0.68rem", color: "#64748B", background: "#EFF6FF", padding: "5px 8px", borderRadius: "5px" }}>
          💡 예시: 테슬라 10주를 2024년 1월 15일에 팔았다
        </div>
      </div>
    ),
  },
  {
    num: "2",
    title: "갈아탄 종목 입력",
    desc: "팔고 산 종목들, 매수일, 비중(%)을 입력하세요. 여러 종목이면 '+ 추가'로 늘릴 수 있어요. 비중 합이 100% 미만이면 나머지는 현금으로 계산됩니다.",
    preview: (
      <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px", fontSize: "0.78rem" }}>
        <div style={{ fontWeight: 800, color: "#64748B", marginBottom: "8px", fontSize: "0.72rem", letterSpacing: "0.05em" }}>
          <span style={{ background: "#070A12", color: "#fff", borderRadius: "999px", padding: "2px 8px", marginRight: "6px", fontSize: "0.68rem" }}>2</span>
          갈아탄 종목
        </div>
        {[
          { sym: "NVDA", date: "2024-01-15", alloc: 60 },
          { sym: "005930", date: "2024-01-15", alloc: 40 },
        ].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.6fr", gap: "5px", marginBottom: "5px" }}>
            <div style={{ background: "#fff", borderRadius: "6px", padding: "6px 9px", border: "1.5px solid #CBD5E1" }}>
              <div style={{ fontSize: "0.62rem", color: "#94A3B8", marginBottom: "2px" }}>종목 {i + 1}</div>
              <div style={{ fontWeight: 800, color: "#070A12" }}>{row.sym}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: "6px", padding: "6px 9px", border: "1.5px solid #CBD5E1" }}>
              <div style={{ fontSize: "0.62rem", color: "#94A3B8", marginBottom: "2px" }}>매수일</div>
              <div style={{ fontWeight: 700, color: "#070A12", fontSize: "0.72rem" }}>{row.date}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: "6px", padding: "6px 9px", border: "1.5px solid #CBD5E1" }}>
              <div style={{ fontSize: "0.62rem", color: "#94A3B8", marginBottom: "2px" }}>비중</div>
              <div style={{ fontWeight: 800, color: "#18A78F" }}>{row.alloc}%</div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "7px" }}>
          <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "#E2E8F0", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "#18A78F", borderRadius: "3px" }} />
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#18A78F" }}>100% ✓</span>
        </div>
      </div>
    ),
  },
  {
    num: "3",
    title: "평가일 설정 후 계산",
    desc: "기준일(보통 오늘)을 고른 뒤 '껄껄 계산하기' 버튼을 누르세요. Yahoo Finance에서 가격을 가져옵니다.",
    preview: (
      <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px", fontSize: "0.78rem" }}>
        <div style={{ fontWeight: 800, color: "#64748B", marginBottom: "8px", fontSize: "0.72rem", letterSpacing: "0.05em" }}>
          <span style={{ background: "#070A12", color: "#fff", borderRadius: "999px", padding: "2px 8px", marginRight: "6px", fontSize: "0.68rem" }}>3</span>
          평가 기준일
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: "6px", padding: "7px 9px", border: "1.5px solid #CBD5E1" }}>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: "3px" }}>평가일</div>
            <div style={{ fontWeight: 700, color: "#070A12" }}>오늘</div>
          </div>
          <div style={{
            background: "#FFD24A",
            color: "#070A12",
            borderRadius: "8px",
            padding: "10px 14px",
            fontWeight: 900,
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}>
            껄껄 계산하기
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "4",
    title: "판정 결과 확인",
    desc: "갈아탄 종목 수익 vs 원래 종목 계속 보유 vs 현금 보유를 한눈에 비교합니다. 기회비용이 + 면 손해, − 면 이득!",
    preview: (
      <div style={{ fontSize: "0.78rem" }}>
        {/* Verdict banner */}
        <div style={{
          background: "linear-gradient(135deg, #FFF3CD, #FFEAA0)",
          border: "2px solid #FFD24A",
          borderRadius: "10px",
          padding: "11px 13px",
          marginBottom: "7px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "2rem" }}>😂</span>
          <div>
            <div style={{ fontSize: "0.65rem", color: "#92400E", fontWeight: 800, letterSpacing: "0.05em" }}>껄껄무새 판정</div>
            <div style={{ fontWeight: 900, color: "#070A12", fontSize: "1rem" }}>껄껄껄</div>
            <div style={{ fontSize: "0.7rem", color: "#78350F" }}>갈아탄 종목이 배신했어요. 원래 종목은 너를 기다렸는데.</div>
          </div>
        </div>
        {/* 3 metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginBottom: "7px" }}>
          {[
            { label: "💸 매도 확보", value: "$2,470", sub: "TSLA · 2024-01-15" },
            { label: "📦 갈아탄 포트", value: "$2,310", sub: "현재 가치", color: "#DC2626" },
            { label: "📈 들고 있었다면", value: "$3,640", sub: "TSLA 현재가" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "7px", padding: "8px 9px", border: "1.5px solid #E2E8F0" }}>
              <div style={{ fontSize: "0.62rem", color: "#64748B" }}>{c.label}</div>
              <div style={{ fontWeight: 800, color: c.color ?? "#070A12", fontSize: "0.82rem", marginTop: "2px" }}>{c.value}</div>
              <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: "2px" }}>{c.sub}</div>
            </div>
          ))}
        </div>
        {/* opportunity cost */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
          <div style={{ background: "#FEF2F2", borderRadius: "7px", padding: "8px 10px", border: "1.5px solid #FECACA" }}>
            <div style={{ fontSize: "0.65rem", color: "#991B1B" }}>vs 계속 보유</div>
            <div style={{ fontWeight: 900, color: "#DC2626", fontSize: "0.9rem" }}>+$1,330</div>
          </div>
          <div style={{ background: "#FEF2F2", borderRadius: "7px", padding: "8px 10px", border: "1.5px solid #FECACA" }}>
            <div style={{ fontSize: "0.65rem", color: "#991B1B" }}>vs 현금 보유</div>
            <div style={{ fontWeight: 900, color: "#DC2626", fontSize: "0.9rem" }}>+$160</div>
          </div>
        </div>
        <div style={{ marginTop: "7px", fontSize: "0.68rem", color: "#64748B", background: "#EFF6FF", padding: "5px 8px", borderRadius: "5px" }}>
          💡 +값이면 갈아탄 손해, −값이면 갈아타서 이득
        </div>
      </div>
    ),
  },
];

export default function UsageGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const cur = STEPS[step];

  return (
    <>
      {/* FAB 버튼 */}
      <button
        onClick={() => { setOpen(true); setStep(0); }}
        aria-label="사용법 보기"
        className="guide-fab animate-bob"
        style={{ animationDelay: "1.1s" }}
      >
        <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>❓</span>
        <span className="contact-fab-tooltip" aria-hidden="true">사용법</span>
      </button>

      {/* 모달 */}
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
              borderRadius: "12px 12px 0 0",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "90dvh",
              overflowY: "auto",
              padding: "24px 20px 32px",
              position: "relative",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
            }}
            className="sm:mb-0 sm:rounded-xl"
          >
            {/* 닫기 */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="닫기"
            >
              ✕
            </button>

            {/* 헤더 */}
            <div className="text-center mb-5">
              <p className="text-3xl mb-1">🦜</p>
              <h2 style={{ fontFamily: "'Do Hyeon', sans-serif", fontSize: "1.25rem", color: "var(--navy)" }}>
                껄껄무새 사용법
              </h2>
              <p style={{ fontSize: "0.78rem", color: "#888", marginTop: "3px" }}>
                팔고 갈아탄 기회비용, 이렇게 계산해요
              </p>
            </div>

            {/* 스텝 인디케이터 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "18px" }}>
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: i === step ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: i === step ? "var(--teal)" : "#D1D5DB",
                    border: "none",
                    cursor: "pointer",
                    transition: "width 0.25s, background 0.2s",
                    padding: 0,
                  }}
                  aria-label={`${i + 1}단계`}
                />
              ))}
            </div>

            {/* 스텝 카드 */}
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "18px 16px",
                border: "1.5px solid #E2E8F0",
                marginBottom: "16px",
              }}
            >
              {/* 스텝 번호 + 제목 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{
                  background: "var(--navy)",
                  color: "#fff",
                  borderRadius: "999px",
                  width: "26px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}>
                  {cur.num}
                </span>
                <span style={{ fontFamily: "'Do Hyeon', sans-serif", fontSize: "1rem", color: "var(--navy)", fontWeight: 700 }}>
                  {cur.title}
                </span>
              </div>

              {/* 설명 */}
              <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.6, marginBottom: "14px" }}>
                {cur.desc}
              </p>

              {/* 미니 캡처 */}
              {cur.preview}
            </div>

            {/* 이전 / 다음 버튼 */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setStep((p) => Math.max(0, p - 1))}
                disabled={step === 0}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "8px",
                  border: "1.5px solid #E2E8F0",
                  background: step === 0 ? "#F8FAFC" : "#fff",
                  color: step === 0 ? "#CBD5E1" : "var(--ink)",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: step === 0 ? "default" : "pointer",
                }}
              >
                ← 이전
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((p) => p + 1)}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--teal)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                  }}
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#FFD24A",
                    color: "var(--ink)",
                    fontWeight: 900,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                  }}
                >
                  껄껄 계산하러 가기 🦜
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
