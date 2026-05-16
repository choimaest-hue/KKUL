"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdSlot from "@/components/AdSlot";
import MarketIndices from "@/components/MarketIndices";
import StockSearch from "@/components/StockSearch";
import FloatingContact from "@/components/FloatingContact";
import UsageGuide from "@/components/UsageGuide";
import { searchStocks } from "@/data/stocks";
import type { Stock } from "@/data/stocks";

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

type BestTradePayload = {
  requestedSymbol: string;
  resolvedSymbol: string;
  currency: Currency;
  startDate: string;
  endDate: string;
  buyDate: string;
  buyPrice: number;
  sellDate: string;
  sellPrice: number;
  returnPct: number;
  gainPerShare: number;
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
  verdictMessageIndex: number;
  soldCurrency: Currency;
  displayFxRate: number;
  soldResolvedSymbol: string;
  soldMatchedDate: string;
  soldPrice: number;
  soldProceeds: number;
  keepMatchedDate: string;
  keepPrice: number;
  keepValue: number;
  totalCurrentValue: number;
  cashAllocation: number;
  cashRemainderValue: number;
  cashHoldValue: number;
  opportunityCostVsHold: number;
  opportunityCostVsCash: number;
  bestTrade: BestTradePayload | null;
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

function convertAmount(value: number, fromCurrency: Currency, toCurrency: Currency, usdKrwRate: number): number {
  if (fromCurrency === toCurrency) return value;
  if (!Number.isFinite(usdKrwRate) || usdKrwRate <= 0) return value;
  return fromCurrency === "USD" ? value * usdKrwRate : value / usdKrwRate;
}

function formatConvertedAmount(
  value: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  usdKrwRate: number,
): string {
  return formatAmount(convertAmount(value, fromCurrency, toCurrency, usdKrwRate), toCurrency);
}

async function fetchClose(symbol: string, date: string): Promise<PricePayload> {
  const res = await fetch(`/api/price?symbol=${encodeURIComponent(symbol)}&date=${date}`);
  const payload = (await res.json()) as PricePayload;
  if (!res.ok) throw new Error(payload.message ?? "가격 데이터를 가져오지 못했습니다.");
  return payload;
}

async function fetchBestTrade(
  symbol: string,
  startDate: string,
  endDate: string,
): Promise<BestTradePayload | null> {
  const params = new URLSearchParams({ symbol, start: startDate, end: endDate });

  try {
    const response = await fetch(`/api/best-trade?${params.toString()}`);
    if (!response.ok) {
      return null;
    }

    return (await response.json()) as BestTradePayload;
  } catch {
    return null;
  }
}

type Verdict = "lose" | "win" | "tie";

type AdViewport = "desktop" | "mobile" | null;

type WizardStage =
  | "soldSymbol"
  | "soldDate"
  | "soldQuantity"
  | "switched"
  | "buySymbol"
  | "buyDate"
  | "allocation"
  | "evaluationDate";

type WizardSwitchAnswer = "yes" | "no" | null;

const MARKET_TEXT: Record<Stock["market"], string> = {
  US: "미국",
  KS: "KOSPI",
  KQ: "KOSDAQ",
};

function useAdViewport(): AdViewport {
  const [adViewport, setAdViewport] = useState<AdViewport>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const update = () => {
      const isDesktop = desktopQuery.matches || window.innerWidth >= 768;
      setAdViewport(isDesktop ? "desktop" : "mobile");
    };

    update();
    desktopQuery.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      desktopQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return adViewport;
}

function getVerdict(opportunityCostVsHold: number): Verdict {
  if (opportunityCostVsHold > 0) return "lose";
  if (opportunityCostVsHold < 0) return "win";
  return "tie";
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0.0%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function getReturnPct(currentValue: number, baseValue: number): number {
  if (!baseValue || !Number.isFinite(baseValue)) return 0;
  return ((currentValue - baseValue) / baseValue) * 100;
}

function makeBuyLine(patch: Partial<BuyLine> = {}): BuyLine {
  return {
    id: `line-${crypto.randomUUID()}`,
    symbol: "",
    buyDate: "",
    allocation: 100,
    ...patch,
  };
}

const VERDICT_CONFIG = {
  lose: {
    moods: [
      { mascot: "/mascot-laugh.svg", emoji: "껄껄껄", title: "못 참겠다, 진짜 껄껄껄" },
      { mascot: "/mascot-cry.svg", emoji: "아이고 배야", title: "놓친 수익이 너무 선명해요" },
      { mascot: "/mascot-dizzy.svg", emoji: "눈앞이 핑", title: "그때 왜 팔았을까요" },
    ],
    messages: [
      "그때 그냥 들고 있었으면 더 벌었어요. 갈아타서 손해 본 기회비용을 확인하세요.",
      "환승 실패. 내린 버스가 고속버스였습니다.",
      "갈아탄 종목이 배신했어요. 원래 종목은 너를 기다렸는데.",
      "매도 버튼 누를 때의 확신, 지금도 유지되시나요?",
      "차트는 말이 없지만, 무새는 웃고 있습니다.",
      "익절이었는데 나중에 보니 예고편이었습니다.",
    ],
    bannerClass: "verdict-lose",
    valueColor: "text-red-600",
    valueColorDark: "text-red-700",
  },
  win: {
    moods: [
      { mascot: "/mascot-shock.svg", emoji: "어? 잘했네?", title: "무새가 한 수 배웠습니다" },
      { mascot: "/mascot-party.svg", emoji: "환승 성공", title: "이건 인정해야겠어요" },
      { mascot: "/mascot-smirk.svg", emoji: "고수의 냄새", title: "그때의 판단이 빛났습니다" },
    ],
    messages: [
      "갈아탄 전략이 정답이었어요. 과거의 나를 신뢰했군요.",
      "이런… 무새가 틀렸습니다. 당신이 이겼어요.",
      "분산투자의 힘인가요, 아니면 신의 한 수인가요?",
      "이번 한 번은 인정합니다. 당신이 맞았어요.",
      "팔고 갈아탄 손이 오늘은 황금손입니다.",
      "무새가 웃으러 왔다가 박수치고 갑니다.",
    ],
    bannerClass: "verdict-win",
    valueColor: "text-emerald-600",
    valueColorDark: "text-emerald-700",
  },
  tie: {
    moods: [
      { mascot: "/mascot-owl.svg", emoji: "무승부", title: "시장도 눈치 게임 중" },
      { mascot: "/mascot-smirk.svg", emoji: "본전 수비", title: "웃기엔 애매하고 울기엔 멀쩡해요" },
    ],
    messages: [
      "어쩌면 이게 운명적인 균형이었을지도 모릅니다.",
      "어떤 선택을 해도 같은 결과. 당신은 시장과 한 몸입니다.",
      "수익도 후회도 거의 제자리. 이 정도면 평화 협정입니다.",
    ],
    bannerClass: "verdict-tie",
    valueColor: "text-amber-600",
    valueColorDark: "text-amber-700",
  },
};

/* ── Component ───────────────────────────────────────────────── */
export default function Home() {
  const adViewport = useAdViewport();
  const adfitTopDesktopUnit =
    process.env.NEXT_PUBLIC_ADFIT_UNIT_TOP_DESKTOP ??
    process.env.NEXT_PUBLIC_ADFIT_UNIT_TOP ??
    "DAN-z7FYy7k6vNgLL2Fw";
  const adfitBottomUnit = process.env.NEXT_PUBLIC_ADFIT_UNIT_BOTTOM ?? "DAN-h7DMLbiSbP20G8DI";
  const showDesktopAd = adViewport === "desktop" && Boolean(adfitTopDesktopUnit);
  const showMobileAd = adViewport !== "desktop" && Boolean(adfitBottomUnit);

  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [soldSymbol, setSoldSymbol] = useState("TSLA");
  const [soldDate, setSoldDate] = useState("");
  const [soldQuantity, setSoldQuantity] = useState(10);
  const [evaluationDate, setEvaluationDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [buys, setBuys] = useState<BuyLine[]>(() => [makeBuyLine({ allocation: 0 })]);
  const [hasSwitched, setHasSwitched] = useState(false);
  const [wizardStage, setWizardStage] = useState<WizardStage>("soldSymbol");
  const [wizardSwitchAnswer, setWizardSwitchAnswer] = useState<WizardSwitchAnswer>(null);
  const [confirmedSoldSymbol, setConfirmedSoldSymbol] = useState("");
  const [confirmedBuySymbol, setConfirmedBuySymbol] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const allocationSum = useMemo(
    () => buys.reduce((sum, l) => sum + (l.allocation || 0), 0),
    [buys],
  );

  const addBuyLine = () => {
    setHasSwitched(true);
    setBuys((p) => [
      ...p,
      { id: `line-${crypto.randomUUID()}`, symbol: "", buyDate: "", allocation: 0 },
    ]);
  };

  const removeBuyLine = (id: string) =>
    setBuys((p) => p.filter((l) => l.id !== id));

  const updateBuyLine = (id: string, patch: Partial<BuyLine>) =>
    setBuys((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const syncBuyDatesToSoldDate = () => {
    if (!soldDate) return;
    setBuys((p) => p.map((l) => ({ ...l, buyDate: soldDate })));
  };

  const changeSoldSymbol = (symbol: string) => {
    setSoldSymbol(symbol);
    setConfirmedSoldSymbol("");
  };

  const updateFirstBuyLine = (patch: Partial<BuyLine>) => {
    setHasSwitched(true);
    setBuys((current) => {
      const [first, ...rest] = current.length ? current : [makeBuyLine({ buyDate: soldDate })];
      return [{ ...first, ...patch }, ...rest];
    });
  };

  const changeFirstBuySymbol = (symbol: string) => {
    setConfirmedBuySymbol("");
    updateFirstBuyLine({ symbol });
  };

  const answerSwitched = (answer: WizardSwitchAnswer) => {
    setWizardSwitchAnswer(answer);
    if (answer === "yes") {
      setHasSwitched(true);
      setBuys([makeBuyLine({ buyDate: soldDate })]);
      setWizardStage("buySymbol");
      return;
    }

    setHasSwitched(false);
    setBuys([makeBuyLine({ allocation: 0 })]);
    setWizardStage("evaluationDate");
  };

  const toggleManualSwitch = (nextValue: boolean) => {
    setHasSwitched(nextValue);
    if (nextValue) {
      setWizardSwitchAnswer("yes");
      setBuys((current) => {
        const hasActiveInput = current.some((line) => line.symbol || line.buyDate || line.allocation > 0);
        return hasActiveInput ? current : initialBuys;
      });
      return;
    }

    setWizardSwitchAnswer("no");
    setBuys([makeBuyLine({ allocation: 0 })]);
  };

  const goWizardBack = () => {
    if (wizardStage === "soldDate") setWizardStage("soldSymbol");
    else if (wizardStage === "soldQuantity") setWizardStage("soldDate");
    else if (wizardStage === "switched") setWizardStage("soldQuantity");
    else if (wizardStage === "buySymbol") setWizardStage("switched");
    else if (wizardStage === "buyDate") setWizardStage("buySymbol");
    else if (wizardStage === "allocation") setWizardStage("buyDate");
    else if (wizardStage === "evaluationDate") {
      setWizardStage(wizardSwitchAnswer === "yes" ? "allocation" : "switched");
    }
  };

  const confirmSoldSymbol = (stock?: Stock) => {
    const symbol = stock?.symbol ?? soldSymbol.trim().toUpperCase();
    if (!symbol) return;
    setSoldSymbol(symbol);
    setConfirmedSoldSymbol(symbol);
    setWizardStage("soldDate");
  };

  const confirmBuySymbol = (stock?: Stock) => {
    const symbol = stock?.symbol ?? firstBuyLine.symbol.trim().toUpperCase();
    if (!symbol) return;
    setConfirmedBuySymbol(symbol);
    updateFirstBuyLine({ symbol });
    setWizardStage("buyDate");
  };

  const calculate = async () => {
    setManualOpen(true);
    setError("");
    setResult(null);
    const activeBuys = buys.filter((line) => line.allocation > 0);
    const cashAllocation = Math.max(0, 100 - allocationSum);

    if (!soldSymbol || !soldDate || !evaluationDate || soldQuantity <= 0) {
      setError("매도 종목, 매도일, 평가일, 수량을 정확히 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (buys.some((line) => line.allocation < 0)) {
      setError("매수 비중은 0% 이상으로 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (allocationSum > 100) {
      setError("갈아탄 종목 비중 합계는 100%를 넘을 수 없습니다.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (activeBuys.some((line) => !line.symbol.trim() || !line.buyDate)) {
      setError("비중이 있는 매수 라인은 종목과 매수일을 모두 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    setLoading(true);
    try {
      const [soldPrice, keepPrice] = await Promise.all([
        fetchClose(soldSymbol, soldDate),
        fetchClose(soldSymbol, evaluationDate),
      ]);
      const displayFxRate = await fetchClose("USDKRW=X", evaluationDate)
        .then((payload) => payload.close)
        .catch(() => 1);
      const soldCurrency = soldPrice.currency;
      const soldProceeds = soldPrice.close * soldQuantity;
      const keepValue = keepPrice.close * soldQuantity;

      const buyResults = await Promise.all(
        activeBuys.map(async (line) => {
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

      const cashRemainderValue = soldProceeds * (cashAllocation / 100);
      const totalCurrentValue =
        buyResults.reduce((s, r) => s + r.currentValueBase, 0) + cashRemainderValue;
      const tradeWindowStart = [soldDate, ...activeBuys.map((line) => line.buyDate)].sort()[0];
      const tradeSymbols = Array.from(
        new Set([soldPrice.resolvedSymbol, ...buyResults.map((line) => line.symbol)]),
      );
      const bestTradeCandidates = tradeWindowStart < evaluationDate
        ? await Promise.all(
            tradeSymbols.map((symbol) => fetchBestTrade(symbol, tradeWindowStart, evaluationDate)),
          )
        : [];
      const bestTrade = bestTradeCandidates.reduce<BestTradePayload | null>((best, candidate) => {
        if (!candidate) {
          return best;
        }

        if (!best || candidate.returnPct > best.returnPct) {
          return candidate;
        }

        return best;
      }, null);
      setDisplayCurrency(soldCurrency);
      setResult({
        verdictMessageIndex: Math.floor(Date.now() / 1000),
        soldCurrency, displayFxRate,
        soldResolvedSymbol: soldPrice.resolvedSymbol, soldMatchedDate: soldPrice.matchedDate,
        soldPrice: soldPrice.close, soldProceeds,
        keepMatchedDate: keepPrice.matchedDate, keepPrice: keepPrice.close, keepValue,
        totalCurrentValue, cashAllocation, cashRemainderValue, cashHoldValue: soldProceeds,
        opportunityCostVsHold: keepValue - totalCurrentValue,
        opportunityCostVsCash: soldProceeds - totalCurrentValue,
        bestTrade,
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
  const verdictMood = vc && result
    ? vc.moods[result.verdictMessageIndex % vc.moods.length]
    : null;
  const verdictMsg = vc && result
    ? vc.messages[result.verdictMessageIndex % vc.messages.length]
    : "";

  /* allocation bar color */
  const allocOver = allocationSum > 100;
  const cashAllocationPreview = Math.max(0, 100 - allocationSum);
  const allocBarColor = allocOver ? "#ef4444" : "#22c55e";

  const hasMobileResultAd = Boolean(result && showMobileAd);

  const firstBuyLine = buys[0] ?? initialBuys[0];
  const soldStockCandidate = useMemo(
    () => searchStocks(soldSymbol, 1)[0] ?? null,
    [soldSymbol],
  );
  const buyStockCandidate = useMemo(
    () => searchStocks(firstBuyLine.symbol, 1)[0] ?? null,
    [firstBuyLine.symbol],
  );
  const soldSymbolConfirmed = Boolean(
    confirmedSoldSymbol && confirmedSoldSymbol === soldSymbol.trim().toUpperCase(),
  );
  const buySymbolConfirmed = Boolean(
    confirmedBuySymbol && confirmedBuySymbol === firstBuyLine.symbol.trim().toUpperCase(),
  );
  const wizardTotalSteps = wizardSwitchAnswer === "yes" ? 8 : 5;
  const wizardStepNumber =
    wizardStage === "soldSymbol" ? 1 :
    wizardStage === "soldDate" ? 2 :
    wizardStage === "soldQuantity" ? 3 :
    wizardStage === "switched" ? 4 :
    wizardStage === "buySymbol" ? 5 :
    wizardStage === "buyDate" ? 6 :
    wizardStage === "allocation" ? 7 :
    wizardTotalSteps;
  const wizardProgress = Math.min(100, (wizardStepNumber / wizardTotalSteps) * 100);

  const resultMetrics = useMemo(() => {
    if (!result) return null;

    const holdReturnPct = getReturnPct(result.keepValue, result.soldProceeds);
    const switchedReturnPct = getReturnPct(result.totalCurrentValue, result.soldProceeds);
    const gapPctOfSold = result.soldProceeds
      ? (result.opportunityCostVsHold / result.soldProceeds) * 100
      : 0;
    const bestValue = Math.max(result.cashHoldValue, result.keepValue, result.totalCurrentValue);
    const winningScenario = bestValue === result.keepValue
      ? "버텼다면"
      : bestValue === result.totalCurrentValue
        ? result.buyResults.length > 0 ? "갈아탔다면" : "현금 보유"
        : "매도 현금";

    return {
      holdReturnPct,
      switchedReturnPct,
      gapPctOfSold,
      winningScenario,
      chartData: [
        { name: "매도 현금", amount: result.cashHoldValue, fill: "#64748B" },
        { name: "버텼다면", amount: result.keepValue, fill: "#F59E0B" },
        {
          name: result.buyResults.length > 0 ? "갈아탔다면" : "현금 보유",
          amount: result.totalCurrentValue,
          fill: result.totalCurrentValue >= result.keepValue ? "#10B981" : "#EF4444",
        },
      ],
    };
  }, [result]);

  const displayChartData = useMemo(() => {
    if (!result || !resultMetrics) return [];

    return resultMetrics.chartData.map((entry) => ({
      ...entry,
      amount: convertAmount(entry.amount, result.soldCurrency, displayCurrency, result.displayFxRate),
    }));
  }, [displayCurrency, result, resultMetrics]);

  return (
    <div className={`min-h-screen pb-24${hasMobileResultAd ? " has-mobile-result-ad" : ""}`} style={{ background: "var(--page-bg)" }}>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-m) 62%, #111827 100%)" }}
      >
        <div className="absolute inset-0 bg-noise opacity-30" />

        <div className="relative mx-auto max-w-5xl px-5 pt-8 pb-7 sm:pt-11 sm:pb-9">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ borderColor: "rgba(255,210,74,0.38)", background: "rgba(255,210,74,0.10)" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--yellow)" }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--yellow)" }}>
                주식 기회비용 계산기
              </span>
            </div>
            <h1 className="sr-only">껄껄무새</h1>
            <Image src="/logo-kkul.svg" alt="껄껄무새" width={560} height={175}
              className="h-auto w-[min(72vw,320px)] sm:w-[400px]" priority />
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-400">
              매도 후 갈아탄 선택의 기회비용을 웃프게 확인합니다.
            </p>
          </div>
        </div>
      </header>

      {/* AdFit top banner (desktop only; not rendered on mobile) */}
      {showDesktopAd && (
        <div className="adfit-wrap flex items-center justify-center px-5">
          <AdSlot unit={adfitTopDesktopUnit} width={728} height={90} className="my-5" />
        </div>
      )}

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:py-8">
        <section className="guided-card">
          <div className="guided-topline">
            <span>질문형 계산</span>
            <span>{wizardStepNumber}/{wizardTotalSteps}</span>
          </div>
          <div className="wizard-progress" aria-hidden="true">
            <span style={{ width: `${wizardProgress}%` }} />
          </div>

          <div className="wizard-question">
            {wizardStage === "soldSymbol" && (
              <>
                <p className="wizard-kicker">첫 질문</p>
                <h2>매도한 종목은?</h2>
                <div className="wizard-control">
                  <StockSearch value={soldSymbol} onChange={changeSoldSymbol} placeholder="TSLA, 테슬라…" />
                </div>
                {soldSymbol.trim() && (
                  <div className={`wizard-confirm-card ${soldSymbolConfirmed ? "confirmed" : ""}`}>
                    {soldStockCandidate ? (
                      <>
                        <span>검색 결과</span>
                        <strong>{soldStockCandidate.symbol} · {soldStockCandidate.nameKo}</strong>
                        <small>{MARKET_TEXT[soldStockCandidate.market]} · {soldStockCandidate.nameEn}</small>
                        <button type="button" onClick={() => confirmSoldSymbol(soldStockCandidate)}>
                          이 종목 맞아요
                        </button>
                      </>
                    ) : (
                      <>
                        <span>직접 입력 심볼</span>
                        <strong>{soldSymbol.trim().toUpperCase()}</strong>
                        <small>검색 목록에 없어도 Yahoo Finance 심볼이면 계산할 수 있습니다.</small>
                        <button type="button" onClick={() => confirmSoldSymbol()}>
                          이 심볼로 진행
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {wizardStage === "soldDate" && (
              <>
                <p className="wizard-kicker">매도 기억 소환</p>
                <h2>언제 팔았나요?</h2>
                <label className="input-wrap wizard-control">
                  <span>매도일</span>
                  <input type="date" value={soldDate} onChange={(event) => setSoldDate(event.target.value)} />
                </label>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={!soldDate} onClick={() => setWizardStage("soldQuantity")}>
                    다음
                  </button>
                </div>
              </>
            )}

            {wizardStage === "soldQuantity" && (
              <>
                <p className="wizard-kicker">수량 확인</p>
                <h2>몇 주를 팔았나요?</h2>
                <label className="input-wrap wizard-control">
                  <span>수량</span>
                  <input type="number" min={0.0001} step="0.0001" value={soldQuantity}
                    onChange={(event) => setSoldQuantity(Number(event.target.value))} />
                </label>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={soldQuantity <= 0} onClick={() => setWizardStage("switched")}>
                    다음
                  </button>
                </div>
              </>
            )}

            {wizardStage === "switched" && (
              <>
                <p className="wizard-kicker">선택의 갈림길</p>
                <h2>그 돈으로 갈아탔나요?</h2>
                <div className="wizard-choice-grid">
                  <button type="button" className="choice-card" onClick={() => answerSwitched("yes")}>
                    <span>네, 다른 종목을 샀어요</span>
                    <strong>갈아탄 결과까지 비교</strong>
                  </button>
                  <button type="button" className="choice-card muted" onClick={() => answerSwitched("no")}>
                    <span>아니요, 현금으로 뒀어요</span>
                    <strong>계속 보유 vs 현금 비교</strong>
                  </button>
                </div>
                <div className="wizard-actions compact-only">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                </div>
              </>
            )}

            {wizardStage === "buySymbol" && (
              <>
                <p className="wizard-kicker">환승 종목</p>
                <h2>다시 산 종목은?</h2>
                <div className="wizard-control">
                  <StockSearch value={firstBuyLine.symbol}
                    onChange={changeFirstBuySymbol}
                    placeholder="NVDA, 005930…" />
                </div>
                {firstBuyLine.symbol.trim() && (
                  <div className={`wizard-confirm-card ${buySymbolConfirmed ? "confirmed" : ""}`}>
                    {buyStockCandidate ? (
                      <>
                        <span>검색 결과</span>
                        <strong>{buyStockCandidate.symbol} · {buyStockCandidate.nameKo}</strong>
                        <small>{MARKET_TEXT[buyStockCandidate.market]} · {buyStockCandidate.nameEn}</small>
                        <button type="button" onClick={() => confirmBuySymbol(buyStockCandidate)}>
                          이 종목 맞아요
                        </button>
                      </>
                    ) : (
                      <>
                        <span>직접 입력 심볼</span>
                        <strong>{firstBuyLine.symbol.trim().toUpperCase()}</strong>
                        <small>검색 목록에 없어도 Yahoo Finance 심볼이면 계산할 수 있습니다.</small>
                        <button type="button" onClick={() => confirmBuySymbol()}>
                          이 심볼로 진행
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="wizard-actions compact-only">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                </div>
              </>
            )}

            {wizardStage === "buyDate" && (
              <>
                <p className="wizard-kicker">재매수 시점</p>
                <h2>언제 다시 샀나요?</h2>
                <label className="input-wrap wizard-control">
                  <span>매수일</span>
                  <input type="date" value={firstBuyLine.buyDate}
                    onChange={(event) => updateFirstBuyLine({ buyDate: event.target.value })} />
                </label>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={!firstBuyLine.buyDate} onClick={() => setWizardStage("allocation")}>
                    다음
                  </button>
                </div>
              </>
            )}

            {wizardStage === "allocation" && (
              <>
                <p className="wizard-kicker">비중</p>
                <h2>매도 자금 중 몇 %를 넣었나요?</h2>
                <label className="input-wrap wizard-control">
                  <span>비중(%)</span>
                  <input type="number" min={0} max={100} step="0.01" value={firstBuyLine.allocation}
                    onChange={(event) => updateFirstBuyLine({ allocation: Number(event.target.value) })} />
                </label>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={firstBuyLine.allocation < 0 || firstBuyLine.allocation > 100} onClick={() => setWizardStage("evaluationDate")}>
                    다음
                  </button>
                </div>
              </>
            )}

            {wizardStage === "evaluationDate" && (
              <>
                <p className="wizard-kicker">지금까지 버텼다면?</p>
                <h2>어느 날짜 기준으로 볼까요?</h2>
                <label className="input-wrap wizard-control">
                  <span>평가일</span>
                  <input type="date" value={evaluationDate} onChange={(event) => setEvaluationDate(event.target.value)} />
                </label>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={loading || !evaluationDate} onClick={calculate}>
                    {loading ? "계산 중..." : "결과 보기"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {error && (
          <div ref={errorRef} className="error-box mt-4">⚠️ {error}</div>
        )}

        <div className="mt-6 space-y-6">
          <div className="space-y-5">
            <details
              className="manual-drawer"
              open={manualOpen}
              onToggle={(event) => setManualOpen(event.currentTarget.open)}
            >
              <summary>
                <span>
                  <strong>직접 입력 모드</strong>
                  <small>매도정보와 갈아탄 종목을 한 번에 수정</small>
                </span>
                <b className="manual-state-label"><span>열기</span><span>접기</span></b>
              </summary>

              <div className="manual-sections">
                <section className="manual-section">
                  <div className="step-header">
                    <span className="step-num">1</span>
                    <span className="step-title">매도 정보</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="input-wrap sm:col-span-1">
                      <span>매도 종목</span>
                      <StockSearch value={soldSymbol} onChange={changeSoldSymbol} placeholder="TSLA, 테슬라…" />
                    </div>
                    <label className="input-wrap">
                      <span>매도일</span>
                      <input type="date" value={soldDate} onChange={(event) => setSoldDate(event.target.value)} />
                    </label>
                    <label className="input-wrap">
                      <span>수량</span>
                      <input type="number" min={0.0001} step="0.0001" value={soldQuantity}
                        onChange={(event) => setSoldQuantity(Number(event.target.value))} />
                    </label>
                  </div>
                </section>

                <section className="manual-section hold-section">
                  <div className="step-header">
                    <span className="step-num">2</span>
                    <span className="step-title">지금까지 버텼다면?</span>
                  </div>
                  <div className="hold-input-grid">
                    <label className="input-wrap">
                      <span>평가 기준일</span>
                      <input type="date" value={evaluationDate}
                        onChange={(event) => setEvaluationDate(event.target.value)} />
                    </label>
                    <div className="hold-preview">
                      <span>비교 기준</span>
                      <strong>{soldSymbol || "매도 종목"}</strong>
                      <small>{soldDate || "매도일"} → {evaluationDate || "평가일"}</small>
                    </div>
                  </div>
                </section>

                <section className="manual-section">
                  <div className="step-header flex-wrap">
                    <span className="step-num">3</span>
                    <span className="step-title">혹시 갈아탔다면?</span>
                    <div className="switch-toggle">
                      <button type="button" className={hasSwitched ? "active" : ""} onClick={() => toggleManualSwitch(true)}>
                        갈아탐
                      </button>
                      <button type="button" className={!hasSwitched ? "active" : ""} onClick={() => toggleManualSwitch(false)}>
                        현금 보유
                      </button>
                    </div>
                  </div>

                  {hasSwitched ? (
                    <>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <button type="button" onClick={syncBuyDatesToSoldDate} disabled={!soldDate}
                          className="fun-btn" title="모든 매수일을 매도일로 맞춤">
                          날짜 맞추기
                        </button>
                        <button type="button" onClick={addBuyLine} className="fun-btn">종목 추가</button>
                      </div>
                      <div className="space-y-3">
                        {buys.map((line, idx) => (
                          <div key={line.id} className="buy-line">
                            <div className="input-wrap compact">
                              <span>종목 {idx + 1}</span>
                              <StockSearch value={line.symbol}
                                onChange={(sym) => updateBuyLine(line.id, { symbol: sym })}
                                placeholder="엔비디아, 삼성…" compact />
                            </div>
                            <label className="input-wrap compact">
                              <span>매수일</span>
                              <input type="date" value={line.buyDate}
                                onChange={(event) => updateBuyLine(line.id, { buyDate: event.target.value })} />
                            </label>
                            <label className="input-wrap compact">
                              <span>비중(%)</span>
                              <input type="number" min={0} max={100} step="0.01" value={line.allocation}
                                onChange={(event) => updateBuyLine(line.id, { allocation: Number(event.target.value) })} />
                            </label>
                            <div className="delete-col flex items-end">
                              <button type="button" onClick={() => removeBuyLine(line.id)}
                                className="remove-btn" disabled={buys.length === 1}>
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="cash-only-box">
                      <strong>갈아탄 종목 없이 현금 보유로 계산합니다.</strong>
                      <span>계속 보유했을 때와 매도 후 현금으로 둔 경우를 비교합니다.</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    <div className="alloc-bar-track">
                      <div className="alloc-bar-fill"
                        style={{ width: `${Math.max(0, Math.min(allocationSum, 100))}%`, background: allocBarColor }} />
                    </div>
                    <span className="shrink-0 text-sm font-black tabular-nums" style={{ color: allocBarColor }}>
                      {allocationSum.toFixed(1)}%
                      {allocOver ? " 초과" : cashAllocationPreview > 0 ? ` · 현금 ${cashAllocationPreview.toFixed(1)}%` : " ✓"}
                    </span>
                  </div>
                </section>

                <section className="manual-section action-section">
                  <button type="button" onClick={calculate} disabled={loading} className="calc-btn">
                    {loading ? "계산 중..." : "껄껄 계산하기"}
                  </button>
                </section>
              </div>
            </details>
          </div>

          <section ref={resultRef} data-result className="mt-5 space-y-4 lg:mt-0">

          {/* Empty state */}
          {!result && !loading && (
            <div className="step-card flex flex-col items-center gap-6 py-12 text-center">
              <div className="relative">
                <Image src="/mascot-owl.svg" alt="껄껄무새" width={108} height={108}
                  className="relative opacity-90" />
              </div>
              <div>
                <p className="text-xl font-black" style={{ fontFamily: "var(--font-do-hyeon), sans-serif", color: "var(--ink)" }}>
                  계산 대기 중
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  매도의 기억을 숫자로 확인해볼 시간입니다
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="step-card flex flex-col items-center gap-6 py-12 text-center">
              <Image src="/mascot-owl.svg" alt="계산 중" width={108} height={108} className="animate-bounce" />
              <p className="text-base font-black" style={{ color: "var(--teal)", fontFamily: "var(--font-do-hyeon), sans-serif" }}>
                Yahoo Finance에서 데이터 가져오는 중…
              </p>
            </div>
          )}

          {/* Results */}
          {result && vc && verdictMood && resultMetrics && (
            <>
              {/* Verdict banner */}
              <div className={vc.bannerClass}>
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <Image src={verdictMood.mascot} alt="판정 마스코트" width={84} height={84}
                      className="relative drop-shadow-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-widest opacity-55">껄껄무새 판정</p>
                    <p className="mt-1 text-2xl font-black leading-tight sm:text-3xl"
                      style={{ fontFamily: "var(--font-do-hyeon), sans-serif" }}>
                      {verdictMood.emoji}
                    </p>
                    <p className="mt-1 text-sm font-black leading-snug opacity-85">{verdictMood.title}</p>
                    <p className="mt-1.5 text-sm font-semibold leading-snug opacity-72">{verdictMsg}</p>
                  </div>
                </div>
              </div>

              <div className="result-toolbar">
                <div>
                  <span>표시 통화</span>
                  <strong>
                    {displayCurrency === "USD" ? "달러 기준" : "원화 기준"}
                  </strong>
                </div>
                <div className="currency-toggle" role="group" aria-label="결과 표시 통화">
                  <button
                    type="button"
                    className={displayCurrency === "USD" ? "active" : ""}
                    onClick={() => setDisplayCurrency("USD")}
                  >
                    달러로 보기
                  </button>
                  <button
                    type="button"
                    className={displayCurrency === "KRW" ? "active" : ""}
                    onClick={() => setDisplayCurrency("KRW")}
                  >
                    원화로 보기
                  </button>
                </div>
              </div>

              <div className="result-scenario-grid">
                <div className="result-card">
                  <p className="label">💸 매도 확보 자금</p>
                  <p className="value">
                    {formatConvertedAmount(result.soldProceeds, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </p>
                  <p className="sub">{result.soldResolvedSymbol} · {result.soldMatchedDate}</p>
                </div>
                <div className="scenario-card hold">
                  <p className="label">지금까지 버텼다면?</p>
                  <p className="value">
                    {formatConvertedAmount(result.keepValue, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </p>
                  <p className="sub">수익률 {formatPercent(resultMetrics.holdReturnPct)} · {result.keepMatchedDate}</p>
                </div>
                <div className="scenario-card switched">
                  <p className="label">{result.buyResults.length > 0 ? "혹시 갈아탔다면?" : "현금으로 뒀다면?"}</p>
                  <p className={`value ${vc.valueColor}`}>
                    {formatConvertedAmount(result.totalCurrentValue, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </p>
                  <p className="sub">수익률 {formatPercent(resultMetrics.switchedReturnPct)}{result.cashAllocation > 0 ? ` · 현금 ${result.cashAllocation.toFixed(1)}%` : ""}</p>
                  {result.buyResults.some((line) => line.currency !== result.soldCurrency) && (
                    <p className="sub accent">환율 기준 환산</p>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-heading">
                  <div>
                    <p>선택별 현재 가치</p>
                    <strong>{resultMetrics.winningScenario} 우세</strong>
                  </div>
                  <span>{Math.abs(resultMetrics.gapPctOfSold).toFixed(1)}% 격차</span>
                </div>
                <div className="scenario-chart">
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={displayChartData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(15,25,40,0.08)" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#6B7FA0", fontSize: 12, fontWeight: 800 }} />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: "rgba(15,25,40,0.04)" }}
                        formatter={(value) => formatAmount(Number(value), displayCurrency)}
                      />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                        {resultMetrics.chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="result-opportunity-grid">
                <div className={`metric-box ${verdict === "lose" ? "loss" : verdict === "win" ? "win" : "neutral"}`}>
                  <span className="label">vs 계속 보유</span>
                  <span className="value">
                    {result.opportunityCostVsHold >= 0 ? "+" : ""}
                    {formatConvertedAmount(result.opportunityCostVsHold, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </span>
                </div>
                <div className={`metric-box ${result.opportunityCostVsCash < 0 ? "win" : result.opportunityCostVsCash > 0 ? "loss" : "neutral"}`}>
                  <span className="label">vs 현금 보유</span>
                  <span className="value">
                    {result.opportunityCostVsCash >= 0 ? "+" : ""}
                    {formatConvertedAmount(result.opportunityCostVsCash, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </span>
                </div>
              </div>

              <details className="insight-details">
                <summary>
                  <span>기회비용 지표 더 보기</span>
                  <b>▼</b>
                </summary>
                <div className="indicator-grid">
                  <div className="indicator-card">
                    <span>보유 수익률</span>
                    <strong>{formatPercent(resultMetrics.holdReturnPct)}</strong>
                  </div>
                  <div className="indicator-card">
                    <span>{result.buyResults.length > 0 ? "환승 수익률" : "현금 수익률"}</span>
                    <strong>{formatPercent(resultMetrics.switchedReturnPct)}</strong>
                  </div>
                  <div className="indicator-card">
                    <span>매도금 대비 차이</span>
                    <strong>{formatPercent(resultMetrics.gapPctOfSold)}</strong>
                  </div>
                  <div className="indicator-card">
                    <span>최종 우세 선택</span>
                    <strong>{resultMetrics.winningScenario}</strong>
                  </div>
                </div>
              </details>

              {result.bestTrade && (
                <div className="timing-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow">껄껄무새 타이밍 훈수</p>
                      <p className="headline">나라면 이랬을 껄껄~</p>
                      <p className="copy">
                        {result.bestTrade.returnPct > 0
                          ? `${result.bestTrade.buyDate}에 ${result.bestTrade.resolvedSymbol} 줍줍, ${result.bestTrade.sellDate}에 호다닥 매도했을 껄껄~`
                          : `${result.bestTrade.startDate}부터 ${result.bestTrade.endDate}까지는 매수 버튼보다 관망 버튼이 더 웃겼을 껄껄~`}
                      </p>
                    </div>
                    <div className={`timing-badge ${result.bestTrade.returnPct > 0 ? "profit" : "flat"}`}>
                      {result.bestTrade.returnPct > 0 ? "+" : ""}
                      {result.bestTrade.returnPct.toFixed(1)}%
                    </div>
                  </div>
                  <div className="timing-prices">
                    <span>
                      매수 {formatAmount(result.bestTrade.buyPrice, result.bestTrade.currency)}
                    </span>
                    <span>
                      매도 {formatAmount(result.bestTrade.sellPrice, result.bestTrade.currency)}
                    </span>
                    <span>
                      1주당 {result.bestTrade.gainPerShare >= 0 ? "+" : ""}
                      {formatAmount(result.bestTrade.gainPerShare, result.bestTrade.currency)}
                    </span>
                  </div>
                </div>
              )}

              <details className="insight-details">
                <summary>
                  <span>종목별 상세 내역</span>
                  <b>▼</b>
                </summary>
                <div className="mt-4 space-y-2">
                  {result.buyResults.map((line) => {
                    const pnl = line.currentValueBase - line.investedBase;
                    const isProfit = pnl >= 0;
                    return (
                      <div key={line.id} className="rounded-lg p-3"
                        style={{ border: "1.5px solid rgba(15,25,40,0.07)", background: "#F8FAFC" }}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black" style={{ color: "var(--ink)" }}>{line.symbol}</span>
                          <span className="text-xs" style={{ color: "var(--muted)" }}>({line.allocation.toFixed(1)}%)</span>
                          {line.currency === "KRW" ? <span className="tag-krw">KRW</span> : <span className="tag-usd">USD</span>}
                          <span className={`ml-auto text-sm font-black tabular-nums ${isProfit ? "text-emerald-600" : "text-red-600"}`}>
                            {isProfit ? "+" : ""}
                            {formatConvertedAmount(pnl, result.soldCurrency, displayCurrency, result.displayFxRate)}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                          <p>
                            매수 {formatAmount(line.buyPrice, line.currency)} ({line.matchedBuyDate})
                            {line.fxAtBuy !== 1 && ` · 환율 ₩${Math.round(line.fxAtBuy).toLocaleString()}`}
                          </p>
                          <p>
                            평가 {formatAmount(line.evalPrice, line.currency)} · {line.shares.toFixed(4)}주 →{" "}
                            {formatAmount(line.currentValueNative, line.currency)}
                            {line.currency !== result.soldCurrency && (
                              <span style={{ color: "#B45309" }}>
                                {" "}({formatConvertedAmount(line.currentValueBase, result.soldCurrency, displayCurrency, result.displayFxRate)} 환산)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {result.cashAllocation > 0 && (
                    <div className="rounded-lg p-3"
                      style={{ border: "1.5px solid rgba(15,25,40,0.07)", background: "#F8FAFC" }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black" style={{ color: "var(--ink)" }}>현금 보유</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>({result.cashAllocation.toFixed(1)}%)</span>
                        <span className="ml-auto text-sm font-black tabular-nums text-slate-600">
                          {formatConvertedAmount(result.cashRemainderValue, result.soldCurrency, displayCurrency, result.displayFxRate)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                        100%에서 남은 비중은 투자 수익률 계산에서 제외하고 현금으로 유지합니다.
                      </p>
                    </div>
                  )}
                </div>
              </details>

            </>
          )}
          </section>
        </div>
      </main>

      {hasMobileResultAd && (
        <AdSlot unit={adfitBottomUnit} width={320} height={100} className="mobile-ad-safe-slot" />
      )}

      <MarketIndices />
      <UsageGuide />
      <FloatingContact />
    </div>
  );
}
