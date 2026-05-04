"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import AdSlot from "@/components/AdSlot";
import MarketIndices from "@/components/MarketIndices";
import StockSearch from "@/components/StockSearch";

/* ── Types ───────────────────────────────────────────────────── */
type Currency = "USD" | "KRW";

type BuyLine = {
  id: string;
  symbol: string;
  buyDate: string;
  allocation: number;
};

type PricePayload = {
  resolvedSymbol: string;
  matchedDate: string;
  close: number;
  currency: Currency;
  message?: string;
};

type BuyResult = {
  id: string;
  symbol: string;
  buyDate: string;
  matchedBuyDate: string;
  buyPrice: number;
  evalPrice: number;
  currency: Currency;
  fxAtBuy: number;
  fxAtEval: number;
  allocation: number;
  investedBase: number;
  investedNative: number;
  shares: number;
  currentValueNative: number;
  currentValueBase: number;
};

type CalcResult = {
  soldCurrency: Currency;
  soldResolvedSymbol: string;
  soldMatchedDate: string;
  soldPrice: number;
  soldProceeds: number;
  keepMatchedDate: string;
  keepPrice: number;
  keepValue: number;
  totalCurrentValue: number;
  cashHoldValue: number;
  opportunityCostVsHold: number;
  opportunityCostVsCash: number;
  buyResults: BuyResult[];
};

/* ── Helpers ─────────────────────────────────────────────────── */
const initialBuys: BuyLine[] = [
  { id: "line-1", symbol: "NVDA", buyDate: "", allocation: 50 },
  { id: "line-2", symbol: "005930", buyDate: "", allocation: 50 },
];

function formatAmount(value: number, currency: Currency): string {
  if (currency === "KRW") {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

async function fetchClose(symbol: string, date: string): Promise<PricePayload> {
  const res = await fetch(`/api/price?symbol=${encodeURIComponent(symbol)}&date=${date}`);
  const payload = (await res.json()) as PricePayload;
  if (!res.ok) throw new Error(payload.message ?? "가격 데이터를 가져오지 못했습니다.");
  return payload;
}

type Verdict = "lose" | "win" | "tie";

function getVerdict(opportunityCostVsHold: number): Verdict {
  if (opportunityCostVsHold > 0) return "lose";
  if (opportunityCostVsHold < 0) return "win";
  return "tie";
}

const VERDICT_CONFIG = {
  lose: {
    mascot: "/mascot-laugh.svg",
    emoji: "껄껄껄",
    title: "못 참겠다, 진짜 껄껄껄",
    messages: [
      "그때 그냥 들고 있었으면 더 벌었어요. 갈아타서 손해 본 기회비용을 확인하세요.",
      "환승 실패. 내린 버스가 고속버스였습니다.",
      "갈아탄 종목이 배신했어요. 원래 종목은 너를 기다렸는데.",
      "매도 버튼 누를 때의 확신, 지금도 유지되시나요?",
    ],
    bannerClass: "verdict-lose",
    valueColor: "text-red-600",
    valueColorDark: "text-red-700",
  },
  win: {
    mascot: "/mascot-shock.svg",
    emoji: "어? 잘했네?",
    title: "어?! 이게 맞아요?",
    messages: [
      "갈아탄 전략이 정답이었어요. 과거의 나를 신뢰했군요.",
      "이런… 무새가 틀렸습니다. 당신이 이겼어요.",
      "분산투자의 힘인가요, 아니면 신의 한 수인가요?",
      "이번 한 번은 인정합니다. 당신이 맞았어요.",
    ],
    bannerClass: "verdict-win",
    valueColor: "text-emerald-600",
    valueColorDark: "text-emerald-700",
  },
  tie: {
    mascot: "/mascot-owl.svg",
    emoji: "무승부",
    title: "시장도 눈치 게임 중",
    messages: [
      "어쩌면 이게 운명적인 균형이었을지도 모릅니다.",
      "어떤 선택을 해도 같은 결과. 당신은 시장과 한 몸입니다.",
    ],
    bannerClass: "verdict-tie",
    valueColor: "text-amber-600",
    valueColorDark: "text-amber-700",
  },
};

/* ── Component ───────────────────────────────────────────────── */
export default function Home() {
  const adsenseTopSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";
  const adfitBottomUnit = process.env.NEXT_PUBLIC_ADFIT_UNIT_BOTTOM ?? "";

  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [soldSymbol, setSoldSymbol] = useState("TSLA");
  const [soldDate, setSoldDate] = useState("");
  const [soldQuantity, setSoldQuantity] = useState(10);
  const [evaluationDate, setEvaluationDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [buys, setBuys] = useState<BuyLine[]>(initialBuys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const allocationSum = useMemo(
    () => buys.reduce((sum, l) => sum + (l.allocation || 0), 0),
    [buys],
  );

  const addBuyLine = () =>
    setBuys((p) => [
      ...p,
      { id: `line-${crypto.randomUUID()}`, symbol: "", buyDate: "", allocation: 0 },
    ]);

  const removeBuyLine = (id: string) =>
    setBuys((p) => p.filter((l) => l.id !== id));

  const updateBuyLine = (id: string, patch: Partial<BuyLine>) =>
    setBuys((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const syncBuyDatesToSoldDate = () => {
    if (!soldDate) return;
    setBuys((p) => p.map((l) => ({ ...l, buyDate: soldDate })));
  };

  const calculate = async () => {
    setError("");
    setResult(null);

    if (!soldSymbol || !soldDate || !evaluationDate || soldQuantity <= 0) {
      setError("매도 종목, 매도일, 평가일, 수량을 정확히 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (allocationSum <= 0 || Math.abs(allocationSum - 100) > 0.01) {
      setError("매수 비중 합계는 정확히 100%여야 합니다.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (buys.some((l) => !l.symbol || !l.buyDate || l.allocation <= 0)) {
      setError("각 매수 라인의 종목, 매수일, 비중을 모두 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    setLoading(true);
    try {
      const [soldPrice, keepPrice] = await Promise.all([
        fetchClose(soldSymbol, soldDate),
        fetchClose(soldSymbol, evaluationDate),
      ]);
      const soldCurrency = soldPrice.currency;
      const soldProceeds = soldPrice.close * soldQuantity;
      const keepValue = keepPrice.close * soldQuantity;

      const buyResults = await Promise.all(
        buys.map(async (line) => {
          const [buyPrice, evalPrice] = await Promise.all([
            fetchClose(line.symbol, line.buyDate),
            fetchClose(line.symbol, evaluationDate),
          ]);
          const buyCurrency = buyPrice.currency;
          const needsFx = soldCurrency !== buyCurrency;
          let fxAtBuy = 1, fxAtEval = 1;
          if (needsFx) {
            [fxAtBuy, fxAtEval] = await Promise.all([
              fetchClose("USDKRW=X", line.buyDate).then((r) => r.close),
              fetchClose("USDKRW=X", evaluationDate).then((r) => r.close),
            ]);
          }
          const investedBase = soldProceeds * (line.allocation / 100);
          let investedNative: number;
          if (soldCurrency === "USD" && buyCurrency === "KRW") investedNative = investedBase * fxAtBuy;
          else if (soldCurrency === "KRW" && buyCurrency === "USD") investedNative = investedBase / fxAtBuy;
          else investedNative = investedBase;

          const shares = investedNative / buyPrice.close;
          const currentValueNative = shares * evalPrice.close;

          let currentValueBase: number;
          if (soldCurrency === "USD" && buyCurrency === "KRW") currentValueBase = currentValueNative / fxAtEval;
          else if (soldCurrency === "KRW" && buyCurrency === "USD") currentValueBase = currentValueNative * fxAtEval;
          else currentValueBase = currentValueNative;

          return {
            id: line.id, symbol: buyPrice.resolvedSymbol, buyDate: line.buyDate,
            matchedBuyDate: buyPrice.matchedDate, buyPrice: buyPrice.close, evalPrice: evalPrice.close,
            currency: buyCurrency, fxAtBuy, fxAtEval, allocation: line.allocation,
            investedBase, investedNative, shares, currentValueNative, currentValueBase,
          } satisfies BuyResult;
        }),
      );

      const totalCurrentValue = buyResults.reduce((s, r) => s + r.currentValueBase, 0);
      setResult({
        soldCurrency, soldResolvedSymbol: soldPrice.resolvedSymbol, soldMatchedDate: soldPrice.matchedDate,
        soldPrice: soldPrice.close, soldProceeds,
        keepMatchedDate: keepPrice.matchedDate, keepPrice: keepPrice.close, keepValue,
        totalCurrentValue, cashHoldValue: soldProceeds,
        opportunityCostVsHold: keepValue - totalCurrentValue,
        opportunityCostVsCash: soldProceeds - totalCurrentValue,
        buyResults,
      });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (e) {
      setError(e instanceof Error ? e.message : "계산 중 알 수 없는 오류가 발생했습니다.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    } finally {
      setLoading(false);
    }
  };

  /* verdict config */
  const verdict = result ? getVerdict(result.opportunityCostVsHold) : null;
  const vc = verdict ? VERDICT_CONFIG[verdict] : null;
  const verdictMsg = vc
    ? vc.messages[Math.floor(Date.now() / 1000) % vc.messages.length]
    : "";

  /* allocation bar color */
  const allocOk = Math.abs(allocationSum - 100) < 0.01;
  const allocOver = allocationSum > 100;
  const allocBarColor = allocOk ? "#22c55e" : allocOver ? "#ef4444" : "#f59e0b";

  return (
    <div className="min-h-screen bg-[--cream] pb-24">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-[#0f1623]">
        <div className="absolute inset-0 bg-noise opacity-20" />
        {/* Gradient blobs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#ffd24a] opacity-10 blur-3xl" />
        <div className="absolute -bottom-10 right-10 h-56 w-56 rounded-full bg-[#18a78f] opacity-15 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-6 sm:py-8">
          <div className="flex-1">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-[#ffd24a]/30 bg-[#ffd24a]/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd24a]" />
              <span className="text-xs font-bold text-[#ffd24a] tracking-widest uppercase">주식 기회비용 계산기</span>
            </div>
            <h1 className="mt-2 text-4xl font-black leading-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-do-hyeon), sans-serif" }}>
              껄껄무새
            </h1>
            <p className="mt-1 text-sm font-semibold leading-snug text-slate-300 sm:text-base">
              매도했더니 오르고, 갈아탔더니 떨어질 때.<br className="sm:hidden" />
              {" "}웃프게 계산해주는 기회비용 계산기.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              종가 기준 · 미국/한국 주식 · 환율 자동 반영
            </p>
          </div>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#ffd24a]/20 blur-xl" />
            <Image
              src="/mascot-owl.svg"
              alt="껄껄무새"
              width={96}
              height={96}
              className="relative h-20 w-20 sm:h-24 sm:w-24 drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        <AdSlot
          network="adsense"
          slotId={adsenseTopSlot}
          className="relative mx-auto max-w-5xl px-5 pb-4"
        />
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:grid lg:grid-cols-[1fr_420px] lg:gap-6 lg:py-8">
        {/* ── LEFT: FORM ──────────────────────────────────────── */}
        <div className="space-y-4">

          {/* STEP 1 ─ 매도 정보 */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-num">1</span>
              <span className="step-title">매도 정보</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="input-wrap sm:col-span-1">
                <span>매도 종목</span>
                <StockSearch
                  value={soldSymbol}
                  onChange={setSoldSymbol}
                  placeholder="TSLA, 테슬라…"
                />
              </div>
              <label className="input-wrap">
                <span>매도일</span>
                <input
                  type="date"
                  value={soldDate}
                  onChange={(e) => setSoldDate(e.target.value)}
                />
              </label>
              <label className="input-wrap">
                <span>수량</span>
                <input
                  type="number"
                  min={0.0001}
                  step="0.0001"
                  value={soldQuantity}
                  onChange={(e) => setSoldQuantity(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          {/* STEP 2 ─ 갈아탄 종목 */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-num">2</span>
              <span className="step-title">갈아탄 종목</span>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={syncBuyDatesToSoldDate}
                  disabled={!soldDate}
                  className="fun-btn"
                  title="모든 매수일을 매도일로 맞춤"
                >
                  📅 날짜 맞추기
                </button>
                <button type="button" onClick={addBuyLine} className="fun-btn">
                  + 추가
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {buys.map((line, idx) => (
                <div key={line.id} className="buy-line">
                  {/* 종목 */}
                  <div className="input-wrap compact">
                    <span>종목 {idx + 1}</span>
                    <StockSearch
                      value={line.symbol}
                      onChange={(sym) => updateBuyLine(line.id, { symbol: sym })}
                      placeholder="엔비디아, 삼성…"
                      compact
                    />
                  </div>
                  {/* 매수일 */}
                  <label className="input-wrap compact">
                    <span>매수일</span>
                    <input
                      type="date"
                      value={line.buyDate}
                      onChange={(e) => updateBuyLine(line.id, { buyDate: e.target.value })}
                    />
                  </label>
                  {/* 비중 */}
                  <label className="input-wrap compact">
                    <span>비중(%)</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.allocation}
                      onChange={(e) =>
                        updateBuyLine(line.id, { allocation: Number(e.target.value) })
                      }
                    />
                  </label>
                  {/* 삭제 */}
                  <div className="delete-col flex items-end">
                    <button
                      type="button"
                      onClick={() => removeBuyLine(line.id)}
                      className="remove-btn"
                      disabled={buys.length === 1}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 비중 바 */}
            <div className="mt-3 flex items-center gap-3">
              <div className="alloc-bar-track">
                <div
                  className="alloc-bar-fill"
                  style={{
                    width: `${Math.min(allocationSum, 100)}%`,
                    background: allocBarColor,
                  }}
                />
              </div>
              <span
                className="shrink-0 text-sm font-black tabular-nums"
                style={{ color: allocBarColor }}
              >
                {allocationSum.toFixed(1)}%{allocOk && " ✓"}
              </span>
            </div>
          </div>

          {/* STEP 3 ─ 평가일 + 계산 */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-num">3</span>
              <span className="step-title">평가 기준일</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="input-wrap flex-1">
                <span>평가일 (오늘 기준 비교)</span>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={calculate}
                disabled={loading}
                className="calc-btn sm:w-auto sm:min-w-[160px]"
              >
                {loading ? "🔄 계산 중…" : "껄껄 계산하기"}
              </button>
            </div>

            {error && (
              <div ref={errorRef} className="error-box mt-3">
                ⚠️ {error}
              </div>
            )}
          </div>

        </div>
        {/* ── RIGHT: RESULTS ────────────────────────────────────── */}
        <section
          ref={resultRef}
          data-result
          className="mt-4 space-y-4 lg:mt-0"
        >
          {/* Empty state */}
          {!result && !loading && (
            <div className="step-card flex flex-col items-center gap-4 py-10 text-center">
              <Image
                src="/mascot-owl.svg"
                alt="껄껄무새"
                width={88}
                height={88}
                className="h-22 w-22 opacity-80"
              />
              <div>
                <p className="text-lg font-black text-[--ink]" style={{ fontFamily: "var(--font-do-hyeon), sans-serif" }}>
                  아직 계산 전이에요
                </p>
                <p className="mt-1 text-sm text-[--muted]">
                  ①②③ 입력 후 껄껄 계산하기를 눌러주세요
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="step-card flex flex-col items-center gap-4 py-10 text-center">
              <div className="relative">
                <Image
                  src="/mascot-owl.svg"
                  alt="계산 중"
                  width={88}
                  height={88}
                  className="h-22 w-22 animate-bounce"
                />
              </div>
              <p className="text-base font-black text-[--teal]">
                Yahoo Finance에서 데이터 가져오는 중…
              </p>
            </div>
          )}

          {/* Results */}
          {result && vc && (
            <>
              {/* Verdict banner */}
              <div className={vc.bannerClass}>
                <div className="flex items-start gap-4">
                  <Image
                    src={vc.mascot}
                    alt="판정 마스코트"
                    width={72}
                    height={72}
                    className="h-16 w-16 shrink-0 drop-shadow-md sm:h-18 sm:w-18"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-widest opacity-70">껄껄무새 판정</p>
                    <p
                      className="mt-0.5 text-xl font-black leading-tight sm:text-2xl"
                      style={{ fontFamily: "var(--font-do-hyeon), sans-serif" }}
                    >
                      {vc.emoji}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug opacity-80">
                      {verdictMsg}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 big metric cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="result-card">
                  <p className="label">💸 매도 확보 자금</p>
                  <p className="value">{formatAmount(result.soldProceeds, result.soldCurrency)}</p>
                  <p className="sub">{result.soldResolvedSymbol} · {result.soldMatchedDate}</p>
                </div>
                <div className="result-card border-[--teal]/30"
                  style={{ background: "linear-gradient(135deg,#f0fdf9,#fff)" }}>
                  <p className="label">📦 갈아탄 포트폴리오</p>
                  <p className={`value ${vc.valueColor}`}>
                    {formatAmount(result.totalCurrentValue, result.soldCurrency)}
                  </p>
                  {result.buyResults.some((r) => r.currency !== result.soldCurrency) && (
                    <p className="sub text-amber-600">★ 환율 기준 환산</p>
                  )}
                </div>
                <div className="result-card">
                  <p className="label">📈 들고 있었다면</p>
                  <p className="value">{formatAmount(result.keepValue, result.soldCurrency)}</p>
                  <p className="sub">{result.soldResolvedSymbol} · {result.keepMatchedDate}</p>
                </div>
              </div>

              {/* Opportunity cost */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`metric-box ${verdict === "lose" ? "loss" : verdict === "win" ? "win" : "neutral"}`}>
                  <span className="label">vs 계속 보유</span>
                  <span className="value">
                    {result.opportunityCostVsHold >= 0 ? "+" : ""}
                    {formatAmount(result.opportunityCostVsHold, result.soldCurrency)}
                  </span>
                </div>
                <div className={`metric-box ${result.opportunityCostVsCash < 0 ? "win" : result.opportunityCostVsCash > 0 ? "loss" : "neutral"}`}>
                  <span className="label">vs 현금 보유</span>
                  <span className="value">
                    {result.opportunityCostVsCash >= 0 ? "+" : ""}
                    {formatAmount(result.opportunityCostVsCash, result.soldCurrency)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <details className="step-card group">
                <summary className="flex cursor-pointer list-none items-center justify-between font-black text-[--ink]">
                  <span style={{ fontFamily: "var(--font-do-hyeon), sans-serif" }}>
                    종목별 상세 내역
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 space-y-2">
                  {result.buyResults.map((line) => {
                    const pnl = line.currentValueBase - line.investedBase;
                    const isProfit = pnl >= 0;
                    return (
                      <div
                        key={line.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-[--ink]">{line.symbol}</span>
                          <span className="text-xs text-slate-400">({line.allocation.toFixed(1)}%)</span>
                          {line.currency === "KRW" ? (
                            <span className="tag-krw">KRW</span>
                          ) : (
                            <span className="tag-usd">USD</span>
                          )}
                          <span className={`ml-auto text-sm font-black tabular-nums ${isProfit ? "text-emerald-600" : "text-red-600"}`}>
                            {isProfit ? "+" : ""}{formatAmount(pnl, result.soldCurrency)}
                          </span>
                        </div>
                        <div className="mt-1.5 space-y-0.5 text-xs text-slate-500">
                          <p>
                            매수 {formatAmount(line.buyPrice, line.currency)} ({line.matchedBuyDate})
                            {line.fxAtBuy !== 1 && ` · 환율 ₩${Math.round(line.fxAtBuy).toLocaleString()}`}
                          </p>
                          <p>
                            평가 {formatAmount(line.evalPrice, line.currency)} ·{" "}
                            {line.shares.toFixed(4)}주 →{" "}
                            {formatAmount(line.currentValueNative, line.currency)}
                            {line.currency !== result.soldCurrency && (
                              <span className="text-amber-600">
                                {" "}({formatAmount(line.currentValueBase, result.soldCurrency)} 환산)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>

              <AdSlot
                network="adfit"
                slotId="unused"
                adfitUnit={adfitBottomUnit}
                className="rounded-2xl bg-white/70 p-2"
              />
            </>
          )}
        </section>
      </main>

      <MarketIndices />
    </div>
  );
}
