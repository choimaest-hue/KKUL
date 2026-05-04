"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";

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
  message?: string;
};

type BuyResult = {
  id: string;
  symbol: string;
  buyDate: string;
  matchedBuyDate: string;
  buyPrice: number;
  evalPrice: number;
  allocation: number;
  invested: number;
  shares: number;
  currentValue: number;
};

type CalcResult = {
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

const initialBuys: BuyLine[] = [
  {
    id: "line-1",
    symbol: "NVDA",
    buyDate: "",
    allocation: 50,
  },
  {
    id: "line-2",
    symbol: "005930",
    buyDate: "",
    allocation: 50,
  },
];

function formatMoney(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

async function fetchClose(symbol: string, date: string): Promise<PricePayload> {
  const response = await fetch(
    `/api/price?symbol=${encodeURIComponent(symbol)}&date=${date}`,
  );

  const payload = (await response.json()) as PricePayload;

  if (!response.ok) {
    throw new Error(payload.message ?? "가격 데이터를 가져오지 못했습니다.");
  }

  return payload;
}

function verdictMessage(value: number): string {
  if (value > 0) {
    return "껄껄무새 판정: 그때 그냥 들고 있었으면 더 웃었을 가능성이 큽니다.";
  }

  if (value < 0) {
    return "껄껄무새 판정: 갈아탄 전략이 승리! 과거의 나를 칭찬해도 됩니다.";
  }

  return "껄껄무새 판정: 완벽한 무승부. 시장도 오늘은 눈치 게임 중.";
}

export default function Home() {
  const adsenseTopSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";
  const adfitBottomUnit = process.env.NEXT_PUBLIC_ADFIT_UNIT_BOTTOM ?? "";

  const [soldSymbol, setSoldSymbol] = useState("TSLA");
  const [soldDate, setSoldDate] = useState("");
  const [soldQuantity, setSoldQuantity] = useState(10);
  const [evaluationDate, setEvaluationDate] = useState("");
  const [buys, setBuys] = useState<BuyLine[]>(initialBuys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const allocationSum = useMemo(
    () => buys.reduce((sum, line) => sum + (line.allocation || 0), 0),
    [buys],
  );

  const addBuyLine = () => {
    setBuys((prev) => [
      ...prev,
      {
        id: `line-${crypto.randomUUID()}`,
        symbol: "",
        buyDate: "",
        allocation: 0,
      },
    ]);
  };

  const removeBuyLine = (id: string) => {
    setBuys((prev) => prev.filter((line) => line.id !== id));
  };

  const updateBuyLine = (id: string, patch: Partial<BuyLine>) => {
    setBuys((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  };

  const calculate = async () => {
    setError("");
    setResult(null);

    if (!soldSymbol || !soldDate || !evaluationDate || soldQuantity <= 0) {
      setError("매도 종목, 매도일, 평가일, 수량을 정확히 입력해주세요.");
      return;
    }

    if (allocationSum <= 0 || Math.abs(allocationSum - 100) > 0.01) {
      setError("매수 비중 합계는 정확히 100%여야 합니다.");
      return;
    }

    if (!buys.length) {
      setError("갈아탈 종목을 최소 1개 이상 입력해주세요.");
      return;
    }

    if (buys.some((line) => !line.symbol || !line.buyDate || line.allocation <= 0)) {
      setError("각 매수 라인의 종목, 매수일, 비중을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const soldPrice = await fetchClose(soldSymbol, soldDate);
      const keepPrice = await fetchClose(soldSymbol, evaluationDate);

      const soldProceeds = soldPrice.close * soldQuantity;
      const keepValue = keepPrice.close * soldQuantity;

      const buyResults = await Promise.all(
        buys.map(async (line) => {
          const buyPrice = await fetchClose(line.symbol, line.buyDate);
          const evalPrice = await fetchClose(line.symbol, evaluationDate);
          const invested = soldProceeds * (line.allocation / 100);
          const shares = invested / buyPrice.close;
          const currentValue = shares * evalPrice.close;

          return {
            id: line.id,
            symbol: buyPrice.resolvedSymbol,
            buyDate: line.buyDate,
            matchedBuyDate: buyPrice.matchedDate,
            buyPrice: buyPrice.close,
            evalPrice: evalPrice.close,
            allocation: line.allocation,
            invested,
            shares,
            currentValue,
          } satisfies BuyResult;
        }),
      );

      const totalCurrentValue = buyResults.reduce(
        (sum, buyLineResult) => sum + buyLineResult.currentValue,
        0,
      );

      setResult({
        soldResolvedSymbol: soldPrice.resolvedSymbol,
        soldMatchedDate: soldPrice.matchedDate,
        soldPrice: soldPrice.close,
        soldProceeds,
        keepMatchedDate: keepPrice.matchedDate,
        keepPrice: keepPrice.close,
        keepValue,
        totalCurrentValue,
        cashHoldValue: soldProceeds,
        opportunityCostVsHold: keepValue - totalCurrentValue,
        opportunityCostVsCash: soldProceeds - totalCurrentValue,
        buyResults,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "계산 중 알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,#fff9e8_0%,#f4f6ff_40%,#ecf7ef_100%)]">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-25" />

      <header className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-7 pb-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 rounded-3xl border border-black/10 bg-white/75 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur md:p-5">
          <Image
            src="/logo-kkul.svg"
            alt="껄껄무새 로고"
            width={56}
            height={56}
            className="h-14 w-14 shrink-0"
            priority
          />
          <div>
            <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
              껄껄무새
            </h1>
            <p className="text-sm text-slate-700 sm:text-base">
              매도했더니 오르고, 갈아탔더니 떨어질 때. 웃프게 계산해주는 기회비용 계산기.
            </p>
          </div>
        </div>
        <AdSlot
          network="adsense"
          slotId={adsenseTopSlot}
          className="rounded-2xl bg-white/70 p-2"
        />
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
        <section className="rounded-3xl border border-slate-900/10 bg-white/80 p-4 shadow-[0_18px_40px_rgba(12,35,64,0.1)] backdrop-blur md:p-6">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900 md:text-2xl">
            입력: 그때의 선택을 재현해보기
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="input-wrap">
              <span>매도 종목</span>
              <input
                value={soldSymbol}
                onChange={(event) => setSoldSymbol(event.target.value)}
                placeholder="예: TSLA 또는 005930"
              />
            </label>
            <label className="input-wrap">
              <span>매도일</span>
              <input
                type="date"
                value={soldDate}
                onChange={(event) => setSoldDate(event.target.value)}
              />
            </label>
            <label className="input-wrap">
              <span>매도 수량</span>
              <input
                type="number"
                min={0.0001}
                step="0.0001"
                value={soldQuantity}
                onChange={(event) => setSoldQuantity(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 md:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">갈아탄 매수 내역</h3>
              <button type="button" onClick={addBuyLine} className="fun-btn">
                + 라인 추가
              </button>
            </div>

            <div className="space-y-2">
              {buys.map((line, index) => (
                <div
                  key={line.id}
                  className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[1.1fr_1fr_0.8fr_auto]"
                >
                  <label className="input-wrap compact">
                    <span>종목 {index + 1}</span>
                    <input
                      value={line.symbol}
                      onChange={(event) =>
                        updateBuyLine(line.id, { symbol: event.target.value })
                      }
                      placeholder="예: NVDA / 000660"
                    />
                  </label>
                  <label className="input-wrap compact">
                    <span>매수일</span>
                    <input
                      type="date"
                      value={line.buyDate}
                      onChange={(event) =>
                        updateBuyLine(line.id, { buyDate: event.target.value })
                      }
                    />
                  </label>
                  <label className="input-wrap compact">
                    <span>비중(%)</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.allocation}
                      onChange={(event) =>
                        updateBuyLine(line.id, {
                          allocation: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeBuyLine(line.id)}
                    className="remove-btn"
                    disabled={buys.length === 1}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>

            <p
              className={`mt-3 text-sm font-semibold ${
                Math.abs(allocationSum - 100) < 0.01
                  ? "text-emerald-700"
                  : "text-rose-700"
              }`}
            >
              현재 비중 합계: {allocationSum.toFixed(2)}%
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <label className="input-wrap">
              <span>평가일 (현재 가치 비교 기준)</span>
              <input
                type="date"
                value={evaluationDate}
                onChange={(event) => setEvaluationDate(event.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={calculate}
              className="calc-btn"
              disabled={loading}
            >
              {loading ? "계산 중..." : "껄껄 계산하기"}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm font-bold text-rose-700">
              {error}
            </p>
          )}
        </section>

        <section className="space-y-6">
          <article className="rounded-3xl border border-slate-900/10 bg-white/85 p-4 shadow-[0_18px_40px_rgba(12,35,64,0.1)] md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">
                  결과: 웃픈 기회비용 리포트
                </h2>
                <p className="text-sm text-slate-600">
                  미국/한국 종목 종가 기반으로, 휴장일이면 직전 거래일 종가를 사용합니다.
                </p>
              </div>
              <Image
                src="/mascot-owl.svg"
                alt="껄껄무새 캐릭터"
                width={64}
                height={64}
                className="h-16 w-16"
              />
            </div>

            {!result ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                아직 계산 전입니다. 좌측 입력을 채우고 껄껄 계산하기를 눌러주세요.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="result-card">
                  <h4>매도 당시 확보 자금</h4>
                  <strong>{formatMoney(result.soldProceeds)}</strong>
                  <p>
                    {result.soldResolvedSymbol} @ {result.soldMatchedDate} 종가 {formatMoney(result.soldPrice)}
                  </p>
                </div>
                <div className="result-card">
                  <h4>갈아탄 포트폴리오 평가액</h4>
                  <strong>{formatMoney(result.totalCurrentValue)}</strong>
                </div>
                <div className="result-card">
                  <h4>그냥 들고 있었다면</h4>
                  <strong>{formatMoney(result.keepValue)}</strong>
                  <p>
                    {result.soldResolvedSymbol} @ {result.keepMatchedDate} 종가 {formatMoney(result.keepPrice)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="metric-box">
                    <span>기회비용 (vs 계속 보유)</span>
                    <strong>{formatMoney(result.opportunityCostVsHold)}</strong>
                  </div>
                  <div className="metric-box">
                    <span>기회비용 (vs 현금 보유)</span>
                    <strong>{formatMoney(result.opportunityCostVsCash)}</strong>
                  </div>
                </div>

                <p className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">
                  {verdictMessage(result.opportunityCostVsHold)}
                </p>
              </div>
            )}
          </article>

          {result && (
            <article className="rounded-3xl border border-slate-900/10 bg-white/85 p-4 shadow-[0_12px_28px_rgba(12,35,64,0.08)] md:p-6">
              <h3 className="mb-3 text-lg font-extrabold text-slate-900">갈아탄 종목별 상세</h3>
              <div className="space-y-2">
                {result.buyResults.map((line) => (
                  <div
                    key={line.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {line.symbol} ({line.allocation.toFixed(2)}%)
                    </p>
                    <p className="text-xs text-slate-700">
                      매수가: {formatMoney(line.buyPrice)} ({line.matchedBuyDate}) · 평가가: {formatMoney(line.evalPrice)}
                    </p>
                    <p className="text-xs text-slate-700">
                      매수금액 {formatMoney(line.invested)} → 보유수량 {line.shares.toFixed(4)} → 현재가치 {formatMoney(line.currentValue)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          )}

          <AdSlot
            network="adfit"
            slotId="unused"
            adfitUnit={adfitBottomUnit}
            className="rounded-2xl bg-white/70 p-2"
          />
        </section>
      </main>
    </div>
  );
}
