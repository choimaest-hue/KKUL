"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
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

type BuyInputMode = "allocation" | "shares";

type SellLine = {
  id: string;
  symbol: string;
  sellDate: string;
  quantity: number;
};

type BuyLine = {
  id: string;
  symbol: string;
  buyDate: string;
  allocation: number;
  quantity: number;
  inputMode: BuyInputMode;
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
  inputMode: BuyInputMode;
  allocation: number;
  investedBase: number;
  investedNative: number;
  shares: number;
  currentValueNative: number;
  currentValueBase: number;
};

type SellResult = {
  id: string;
  symbol: string;
  sellDate: string;
  matchedSellDate: string;
  keepMatchedDate: string;
  sellPrice: number;
  keepPrice: number;
  currency: Currency;
  fxAtSell: number;
  fxAtEval: number;
  quantity: number;
  soldProceedsNative: number;
  soldProceedsBase: number;
  keepValueNative: number;
  keepValueBase: number;
};

type CalcResult = {
  verdictMessageIndex: number;
  soldCurrency: Currency;
  displayFxRate: number;
  soldResults: SellResult[];
  soldResolvedSymbol: string;
  soldMatchedDate: string;
  soldPrice: number;
  soldProceeds: number;
  keepMatchedDate: string;
  keepPrice: number;
  keepValue: number;
  holdScenarioValue: number;
  totalCurrentValue: number;
  totalInvestedBase: number;
  additionalCashBase: number;
  additionalCashAllocation: number;
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
  { id: "line-1", symbol: "NVDA", buyDate: "", allocation: 50, quantity: 0, inputMode: "allocation" },
  { id: "line-2", symbol: "005930", buyDate: "", allocation: 50, quantity: 0, inputMode: "allocation" },
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

function getLocalDateInputValue(date = new Date()): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function isFutureDate(value: string, today: string): boolean {
  return Boolean(value && value > today);
}

const FUTURE_DATE_MESSAGE = "미래는 아직 예측 못해요. 오늘 이전 날짜를 선택해주세요.";

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  maxDate: string;
  onChange: (value: string) => void;
  className?: string;
  compact?: boolean;
  children?: ReactNode;
};

function DateField({ id, label, value, maxDate, onChange, className = "", compact = false, children }: DateFieldProps) {
  const hasFutureWarning = isFutureDate(value, maxDate);
  const warningId = `${id}-future-warning`;
  const classes = ["input-wrap", compact ? "compact" : "", className, hasFutureWarning ? "has-date-warning" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      <span>{label}</span>
      <input
        id={id}
        type="date"
        value={value}
        max={maxDate}
        aria-invalid={hasFutureWarning || undefined}
        aria-describedby={hasFutureWarning ? warningId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {children}
      {hasFutureWarning && (
        <small id={warningId} className="date-warning" role="alert">
          {FUTURE_DATE_MESSAGE}
        </small>
      )}
    </label>
  );
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
  | "addAnotherBuy"
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

function makeSellLine(patch: Partial<SellLine> = {}): SellLine {
  return {
    id: `sell-${crypto.randomUUID()}`,
    symbol: "",
    sellDate: "",
    quantity: 0,
    ...patch,
  };
}

function makeBuyLine(patch: Partial<BuyLine> = {}): BuyLine {
  return {
    id: `line-${crypto.randomUUID()}`,
    symbol: "",
    buyDate: "",
    allocation: 100,
    quantity: 0,
    inputMode: "allocation",
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
  const [extraSoldLines, setExtraSoldLines] = useState<SellLine[]>([]);
  const [evaluationDate, setEvaluationDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [buys, setBuys] = useState<BuyLine[]>(() => [makeBuyLine({ allocation: 0 })]);
  const [hasSwitched, setHasSwitched] = useState(false);
  const [wizardStage, setWizardStage] = useState<WizardStage>("soldSymbol");
  const [wizardBuyIndex, setWizardBuyIndex] = useState(0);
  const [wizardSwitchAnswer, setWizardSwitchAnswer] = useState<WizardSwitchAnswer>(null);
  const [confirmedSoldSymbol, setConfirmedSoldSymbol] = useState("");
  const [confirmedBuySymbol, setConfirmedBuySymbol] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [showManualNudge, setShowManualNudge] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const todayIso = useMemo(() => getLocalDateInputValue(), []);

  const allocationSum = useMemo(
    () => buys.reduce((sum, line) => (
      line.inputMode === "allocation" ? sum + (line.allocation || 0) : sum
    ), 0),
    [buys],
  );
  const soldDateFuture = isFutureDate(soldDate, todayIso);
  const evaluationDateFuture = isFutureDate(evaluationDate, todayIso);
  const currentWizardBuyDateFuture = isFutureDate(buys[wizardBuyIndex]?.buyDate ?? "", todayIso);
  const manualFutureDate = soldDateFuture
    || evaluationDateFuture
    || extraSoldLines.some((line) => isFutureDate(line.sellDate, todayIso))
    || (hasSwitched && buys.some((line) => {
      const hasActiveInput = line.inputMode === "shares" ? line.quantity > 0 : line.allocation > 0;
      return hasActiveInput && isFutureDate(line.buyDate, todayIso);
    }));

  const addBuyLine = () => {
    setHasSwitched(true);
    setBuys((p) => [
      ...p,
      makeBuyLine({ buyDate: soldDate, allocation: 0 }),
    ]);
  };

  const addSellLine = () => {
    setExtraSoldLines((current) => [
      ...current,
      makeSellLine({ sellDate: soldDate }),
    ]);
  };

  const updateExtraSellLine = (id: string, patch: Partial<SellLine>) => {
    setExtraSoldLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  };

  const removeExtraSellLine = (id: string) => {
    setExtraSoldLines((current) => current.filter((line) => line.id !== id));
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

  const updateWizardBuyLine = (patch: Partial<BuyLine>) => {
    setHasSwitched(true);
    setBuys((current) => current.map((line, index) => (
      index === wizardBuyIndex ? { ...line, ...patch } : line
    )));
  };

  const changeWizardBuySymbol = (symbol: string) => {
    setConfirmedBuySymbol("");
    updateWizardBuyLine({ symbol });
  };

  const startAnotherWizardBuy = () => {
    const nextIndex = buys.length;
    setBuys((current) => [...current, makeBuyLine({ buyDate: soldDate, allocation: 0 })]);
    setWizardBuyIndex(nextIndex);
    setConfirmedBuySymbol("");
    setWizardStage("buySymbol");
  };

  const answerSwitched = (answer: WizardSwitchAnswer) => {
    setWizardSwitchAnswer(answer);
    if (answer === "yes") {
      setHasSwitched(true);
      setWizardBuyIndex(0);
      setBuys([makeBuyLine({ buyDate: soldDate })]);
      setWizardStage("buySymbol");
      return;
    }

    setHasSwitched(false);
    setWizardBuyIndex(0);
    setBuys([makeBuyLine({ allocation: 0 })]);
    setWizardStage("evaluationDate");
  };

  const toggleManualSwitch = (nextValue: boolean) => {
    setHasSwitched(nextValue);
    if (nextValue) {
      setWizardSwitchAnswer("yes");
      setBuys((current) => {
        const hasActiveInput = current.some((line) => line.symbol || line.buyDate || line.allocation > 0 || line.quantity > 0);
        return hasActiveInput ? current : [makeBuyLine({ buyDate: soldDate })];
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
    else if (wizardStage === "addAnotherBuy") setWizardStage("allocation");
    else if (wizardStage === "evaluationDate") {
      setWizardStage(wizardSwitchAnswer === "yes" ? "addAnotherBuy" : "switched");
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
    const symbol = stock?.symbol ?? currentWizardBuyLine.symbol.trim().toUpperCase();
    if (!symbol) return;
    setConfirmedBuySymbol(symbol);
    updateWizardBuyLine({ symbol });
    setWizardStage("buyDate");
  };

  const calculate = async (source: "wizard" | "manual" = "manual") => {
    setManualOpen(true);
    setError("");
    setResult(null);
    setShowManualNudge(false);
    const sellInputs = [
      { id: "primary-sell", symbol: soldSymbol, sellDate: soldDate, quantity: soldQuantity },
      ...extraSoldLines,
    ].filter((line, index) => (
      index === 0 || line.symbol.trim() || line.sellDate || line.quantity > 0
    ));
    const activeBuys = hasSwitched
      ? buys.filter((line) => (
          line.inputMode === "shares" ? line.quantity > 0 : line.allocation > 0
        ))
      : [];

    if (!evaluationDate || sellInputs.some((line) => !line.symbol.trim() || !line.sellDate || line.quantity <= 0)) {
      setError("매도 종목, 매도일, 평가일, 수량을 정확히 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (
      isFutureDate(evaluationDate, todayIso)
      || sellInputs.some((line) => isFutureDate(line.sellDate, todayIso))
      || activeBuys.some((line) => isFutureDate(line.buyDate, todayIso))
    ) {
      setError(FUTURE_DATE_MESSAGE);
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (buys.some((line) => line.allocation < 0 || line.quantity < 0)) {
      setError("매수 비중과 주식수는 0 이상으로 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (activeBuys.some((line) => !line.symbol.trim() || !line.buyDate)) {
      setError("입력한 매수 라인은 종목과 매수일을 모두 입력해주세요.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    setLoading(true);
    try {
      const fxCache = new Map<string, number>();
      const getFxRate = async (date: string) => {
        const cached = fxCache.get(date);
        if (cached) return cached;
        const rate = await fetchClose("USDKRW=X", date).then((payload) => payload.close);
        fxCache.set(date, rate);
        return rate;
      };

      const sellPricePairs = await Promise.all(
        sellInputs.map(async (line) => {
          const [sellPrice, keepPrice] = await Promise.all([
            fetchClose(line.symbol, line.sellDate),
            fetchClose(line.symbol, evaluationDate),
          ]);
          return { line, sellPrice, keepPrice };
        }),
      );

      const soldCurrency = sellPricePairs[0].sellPrice.currency;
      const displayFxRate = await getFxRate(evaluationDate).catch(() => 1);

      const soldResults = await Promise.all(
        sellPricePairs.map(async ({ line, sellPrice, keepPrice }) => {
          const currency = sellPrice.currency;
          const soldProceedsNative = sellPrice.close * line.quantity;
          const keepValueNative = keepPrice.close * line.quantity;
          const fxAtSell = currency === soldCurrency ? 1 : await getFxRate(line.sellDate);
          const fxAtEval = currency === soldCurrency ? 1 : await getFxRate(evaluationDate);
          const soldProceedsBase = convertAmount(soldProceedsNative, currency, soldCurrency, fxAtSell);
          const keepValueBase = convertAmount(keepValueNative, currency, soldCurrency, fxAtEval);

          return {
            id: line.id,
            symbol: sellPrice.resolvedSymbol,
            sellDate: line.sellDate,
            matchedSellDate: sellPrice.matchedDate,
            keepMatchedDate: keepPrice.matchedDate,
            sellPrice: sellPrice.close,
            keepPrice: keepPrice.close,
            currency,
            fxAtSell,
            fxAtEval,
            quantity: line.quantity,
            soldProceedsNative,
            soldProceedsBase,
            keepValueNative,
            keepValueBase,
          } satisfies SellResult;
        }),
      );

      const primarySold = soldResults[0];
      const soldProceeds = soldResults.reduce((sum, line) => sum + line.soldProceedsBase, 0);
      const keepValue = soldResults.reduce((sum, line) => sum + line.keepValueBase, 0);

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
              getFxRate(line.buyDate),
              getFxRate(evaluationDate),
            ]);
          }
          let investedBase: number;
          let investedNative: number;
          let shares: number;

          if (line.inputMode === "shares") {
            shares = line.quantity;
            investedNative = shares * buyPrice.close;
            investedBase = convertAmount(investedNative, buyCurrency, soldCurrency, fxAtBuy);
          } else {
            investedBase = soldProceeds * (line.allocation / 100);
            investedNative = convertAmount(investedBase, soldCurrency, buyCurrency, fxAtBuy);
            shares = investedNative / buyPrice.close;
          }

          const currentValueNative = shares * evalPrice.close;
          const currentValueBase = convertAmount(currentValueNative, buyCurrency, soldCurrency, fxAtEval);
          const allocation = soldProceeds ? (investedBase / soldProceeds) * 100 : 0;

          return {
            id: line.id, symbol: buyPrice.resolvedSymbol, buyDate: line.buyDate,
            matchedBuyDate: buyPrice.matchedDate, buyPrice: buyPrice.close, evalPrice: evalPrice.close,
            currency: buyCurrency, fxAtBuy, fxAtEval, inputMode: line.inputMode, allocation,
            investedBase, investedNative, shares, currentValueNative, currentValueBase,
          } satisfies BuyResult;
        }),
      );

      const totalInvestedBase = buyResults.reduce((sum, line) => sum + line.investedBase, 0);
      const additionalCashBase = Math.max(0, totalInvestedBase - soldProceeds);
      const cashRemainderValue = Math.max(0, soldProceeds - totalInvestedBase);
      const cashAllocation = soldProceeds ? (cashRemainderValue / soldProceeds) * 100 : 0;
      const additionalCashAllocation = soldProceeds ? (additionalCashBase / soldProceeds) * 100 : 0;
      const holdScenarioValue = keepValue + additionalCashBase;
      const cashHoldValue = soldProceeds + additionalCashBase;
      const totalCurrentValue =
        buyResults.reduce((s, r) => s + r.currentValueBase, 0) + cashRemainderValue;
      const tradeWindowStart = [
        ...sellInputs.map((line) => line.sellDate),
        ...activeBuys.map((line) => line.buyDate),
      ].sort()[0];
      const tradeSymbols = Array.from(
        new Set([...soldResults.map((line) => line.symbol), ...buyResults.map((line) => line.symbol)]),
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
      setShowManualNudge(source === "wizard");
      setResult({
        verdictMessageIndex: Math.floor(Date.now() / 1000),
        soldCurrency, displayFxRate,
        soldResults,
        soldResolvedSymbol: primarySold.symbol, soldMatchedDate: primarySold.matchedSellDate,
        soldPrice: primarySold.sellPrice, soldProceeds,
        keepMatchedDate: primarySold.keepMatchedDate, keepPrice: primarySold.keepPrice, keepValue,
        holdScenarioValue,
        totalCurrentValue, totalInvestedBase, additionalCashBase, additionalCashAllocation,
        cashAllocation, cashRemainderValue, cashHoldValue,
        opportunityCostVsHold: holdScenarioValue - totalCurrentValue,
        opportunityCostVsCash: cashHoldValue - totalCurrentValue,
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
  const allocBarColor = allocOver ? "#f97316" : "#22c55e";
  const shareModeCount = buys.filter((line) => line.inputMode === "shares" && line.quantity > 0).length;

  const hasMobileResultAd = Boolean(result && showMobileAd);

  const firstBuyLine = buys[0] ?? initialBuys[0];
  const currentWizardBuyLine = buys[wizardBuyIndex] ?? firstBuyLine;
  const soldStockCandidate = useMemo(
    () => searchStocks(soldSymbol, 1)[0] ?? null,
    [soldSymbol],
  );
  const buyStockCandidate = useMemo(
    () => searchStocks(currentWizardBuyLine.symbol, 1)[0] ?? null,
    [currentWizardBuyLine.symbol],
  );
  const soldSymbolConfirmed = Boolean(
    confirmedSoldSymbol && confirmedSoldSymbol === soldSymbol.trim().toUpperCase(),
  );
  const buySymbolConfirmed = Boolean(
    confirmedBuySymbol && confirmedBuySymbol === currentWizardBuyLine.symbol.trim().toUpperCase(),
  );
  const wizardBuyInputReady = currentWizardBuyLine.inputMode === "shares"
    ? currentWizardBuyLine.quantity > 0
    : currentWizardBuyLine.allocation > 0;
  const wizardTotalSteps = wizardSwitchAnswer === "yes" ? 9 : 5;
  const wizardStepNumber =
    wizardStage === "soldSymbol" ? 1 :
    wizardStage === "soldDate" ? 2 :
    wizardStage === "soldQuantity" ? 3 :
    wizardStage === "switched" ? 4 :
    wizardStage === "buySymbol" ? 5 :
    wizardStage === "buyDate" ? 6 :
    wizardStage === "allocation" ? 7 :
    wizardStage === "addAnotherBuy" ? 8 :
    wizardTotalSteps;
  const wizardProgress = Math.min(100, (wizardStepNumber / wizardTotalSteps) * 100);

  const resultMetrics = useMemo(() => {
    if (!result) return null;

    const holdReturnPct = getReturnPct(result.holdScenarioValue, result.cashHoldValue);
    const switchedReturnPct = getReturnPct(result.totalCurrentValue, result.cashHoldValue);
    const gapPctOfSold = result.cashHoldValue
      ? (result.opportunityCostVsHold / result.cashHoldValue) * 100
      : 0;
    const bestValue = Math.max(result.cashHoldValue, result.holdScenarioValue, result.totalCurrentValue);
    const winningScenario = bestValue === result.holdScenarioValue
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
        { name: result.additionalCashBase > 0 ? "매도+추가 현금" : "매도 현금", amount: result.cashHoldValue, fill: "#64748B" },
        { name: "버텼다면", amount: result.holdScenarioValue, fill: "#F59E0B" },
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
                        <button type="button" onMouseDown={(event) => { event.preventDefault(); confirmSoldSymbol(soldStockCandidate); }} onClick={() => confirmSoldSymbol(soldStockCandidate)}>
                          이 종목 맞아요
                        </button>
                      </>
                    ) : (
                      <>
                        <span>직접 입력 심볼</span>
                        <strong>{soldSymbol.trim().toUpperCase()}</strong>
                        <small>검색 목록에 없어도 Yahoo Finance 심볼이면 계산할 수 있습니다.</small>
                        <button type="button" onMouseDown={(event) => { event.preventDefault(); confirmSoldSymbol(); }} onClick={() => confirmSoldSymbol()}>
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
                <DateField id="wizard-sold-date" label="매도일" value={soldDate} maxDate={todayIso}
                  onChange={setSoldDate} className="wizard-control" />
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={!soldDate || soldDateFuture} onClick={() => setWizardStage("soldQuantity")}>
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
                <h2>{wizardBuyIndex + 1}번째로 다시 산 종목은?</h2>
                <div className="wizard-control">
                  <StockSearch value={currentWizardBuyLine.symbol}
                    onChange={changeWizardBuySymbol}
                    placeholder="NVDA, 005930…" />
                </div>
                {currentWizardBuyLine.symbol.trim() && (
                  <div className={`wizard-confirm-card ${buySymbolConfirmed ? "confirmed" : ""}`}>
                    {buyStockCandidate ? (
                      <>
                        <span>검색 결과</span>
                        <strong>{buyStockCandidate.symbol} · {buyStockCandidate.nameKo}</strong>
                        <small>{MARKET_TEXT[buyStockCandidate.market]} · {buyStockCandidate.nameEn}</small>
                        <button type="button" onMouseDown={(event) => { event.preventDefault(); confirmBuySymbol(buyStockCandidate); }} onClick={() => confirmBuySymbol(buyStockCandidate)}>
                          이 종목 맞아요
                        </button>
                      </>
                    ) : (
                      <>
                        <span>직접 입력 심볼</span>
                        <strong>{currentWizardBuyLine.symbol.trim().toUpperCase()}</strong>
                        <small>검색 목록에 없어도 Yahoo Finance 심볼이면 계산할 수 있습니다.</small>
                        <button type="button" onMouseDown={(event) => { event.preventDefault(); confirmBuySymbol(); }} onClick={() => confirmBuySymbol()}>
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
                <DateField id="wizard-buy-date" label="매수일" value={currentWizardBuyLine.buyDate} maxDate={todayIso}
                  onChange={(value) => updateWizardBuyLine({ buyDate: value })} className="wizard-control" />
                <div className="wizard-inline-actions">
                  <button type="button" className="fun-btn" disabled={!soldDate} onClick={() => updateWizardBuyLine({ buyDate: soldDate })}>
                    매도일과 같은 날짜
                  </button>
                </div>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={!currentWizardBuyLine.buyDate || currentWizardBuyDateFuture} onClick={() => setWizardStage("allocation")}>
                    다음
                  </button>
                </div>
              </>
            )}

            {wizardStage === "allocation" && (
              <>
                <p className="wizard-kicker">비중</p>
                <h2>비율로 샀나요, 주식수로 샀나요?</h2>
                <div className="wizard-control mode-panel">
                  <div className="line-mode-toggle" role="group" aria-label="매수 입력 방식">
                    <button type="button" className={currentWizardBuyLine.inputMode === "allocation" ? "active" : ""}
                      onClick={() => updateWizardBuyLine({ inputMode: "allocation" })}>
                      비율
                    </button>
                    <button type="button" className={currentWizardBuyLine.inputMode === "shares" ? "active" : ""}
                      onClick={() => updateWizardBuyLine({ inputMode: "shares" })}>
                      주식수
                    </button>
                  </div>
                  <label className="input-wrap">
                    <span>{currentWizardBuyLine.inputMode === "allocation" ? "비중(%)" : "매수 주식수"}</span>
                    <input type="number" min={0} step={currentWizardBuyLine.inputMode === "allocation" ? "0.01" : "0.0001"}
                      value={currentWizardBuyLine.inputMode === "allocation" ? currentWizardBuyLine.allocation : currentWizardBuyLine.quantity}
                      onChange={(event) => updateWizardBuyLine(
                        currentWizardBuyLine.inputMode === "allocation"
                          ? { allocation: Number(event.target.value) }
                          : { quantity: Number(event.target.value) },
                      )} />
                  </label>
                  <p className="mode-help">
                    비율이 100%를 넘거나 주식수 기준 매수액이 매도금보다 크면, 초과분은 추가 투입 현금으로 계산합니다.
                  </p>
                </div>
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={!wizardBuyInputReady} onClick={() => setWizardStage("addAnotherBuy")}>
                    다음
                  </button>
                </div>
              </>
            )}

            {wizardStage === "addAnotherBuy" && (
              <>
                <p className="wizard-kicker">환승이 한 번으로 끝났을 리가</p>
                <h2>갈아탄 종목이 더 있나요?</h2>
                <div className="wizard-choice-grid">
                  <button type="button" className="choice-card" onClick={startAnotherWizardBuy}>
                    <span>네, 하나 더 있어요</span>
                    <strong>다음 종목도 입력</strong>
                  </button>
                  <button type="button" className="choice-card muted" onClick={() => setWizardStage("evaluationDate")}>
                    <span>이제 그만 캐묻죠</span>
                    <strong>평가일로 넘어가기</strong>
                  </button>
                </div>
                <div className="wizard-actions compact-only">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                </div>
              </>
            )}

            {wizardStage === "evaluationDate" && (
              <>
                <p className="wizard-kicker">지금까지 버텼다면?</p>
                <h2>어느 날짜 기준으로 볼까요?</h2>
                <DateField id="wizard-evaluation-date" label="평가일" value={evaluationDate} maxDate={todayIso}
                  onChange={setEvaluationDate} className="wizard-control" />
                <div className="wizard-actions">
                  <button type="button" className="ghost-btn" onClick={goWizardBack}>이전</button>
                  <button type="button" className="calc-btn" disabled={loading || !evaluationDate || evaluationDateFuture} onClick={() => calculate("wizard")}>
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
                  <div className="mb-3 flex flex-wrap gap-2">
                    <button type="button" onClick={addSellLine} className="fun-btn">매도 종목 추가</button>
                  </div>
                  <div className="space-y-3">
                    <div className="buy-line sell-line">
                      <div className="input-wrap compact">
                        <span>매도 종목 1</span>
                        <StockSearch value={soldSymbol} onChange={changeSoldSymbol} placeholder="TSLA, 테슬라…" compact />
                      </div>
                      <DateField id="manual-sold-date-primary" label="매도일" value={soldDate} maxDate={todayIso}
                        onChange={setSoldDate} compact />
                      <label className="input-wrap compact">
                        <span>매도 주식수</span>
                        <input type="number" min={0.0001} step="0.0001" value={soldQuantity}
                          onChange={(event) => setSoldQuantity(Number(event.target.value))} />
                      </label>
                      <div className="delete-col flex items-end">
                        <button type="button" className="remove-btn" disabled>기준</button>
                      </div>
                    </div>
                    {extraSoldLines.map((line, index) => (
                      <div key={line.id} className="buy-line sell-line">
                        <div className="input-wrap compact">
                          <span>매도 종목 {index + 2}</span>
                          <StockSearch value={line.symbol}
                            onChange={(symbol) => updateExtraSellLine(line.id, { symbol })}
                            placeholder="AAPL, 000660…" compact />
                        </div>
                        <DateField id={`manual-sold-date-${line.id}`} label="매도일" value={line.sellDate} maxDate={todayIso}
                          onChange={(value) => updateExtraSellLine(line.id, { sellDate: value })} compact />
                        <label className="input-wrap compact">
                          <span>매도 주식수</span>
                          <input type="number" min={0.0001} step="0.0001" value={line.quantity}
                            onChange={(event) => updateExtraSellLine(line.id, { quantity: Number(event.target.value) })} />
                        </label>
                        <div className="delete-col flex items-end">
                          <button type="button" onClick={() => removeExtraSellLine(line.id)} className="remove-btn">
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="manual-section hold-section">
                  <div className="step-header">
                    <span className="step-num">2</span>
                    <span className="step-title">지금까지 버텼다면?</span>
                  </div>
                  <div className="hold-input-grid">
                    <DateField id="manual-evaluation-date" label="평가 기준일" value={evaluationDate} maxDate={todayIso}
                      onChange={setEvaluationDate} />
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
                            <DateField id={`manual-buy-date-${line.id}`} label="매수일" value={line.buyDate} maxDate={todayIso}
                              onChange={(value) => updateBuyLine(line.id, { buyDate: value })} compact>
                              <button type="button" className="mini-link" disabled={!soldDate}
                                onClick={() => updateBuyLine(line.id, { buyDate: soldDate })}>
                                같은 날짜
                              </button>
                            </DateField>
                            <div className="input-wrap compact">
                              <span>입력 방식</span>
                              <div className="line-mode-toggle" role="group" aria-label={`종목 ${idx + 1} 입력 방식`}>
                                <button type="button" className={line.inputMode === "allocation" ? "active" : ""}
                                  onClick={() => updateBuyLine(line.id, { inputMode: "allocation" })}>
                                  비율
                                </button>
                                <button type="button" className={line.inputMode === "shares" ? "active" : ""}
                                  onClick={() => updateBuyLine(line.id, { inputMode: "shares" })}>
                                  주식수
                                </button>
                              </div>
                              <input type="number" min={0} step={line.inputMode === "allocation" ? "0.01" : "0.0001"}
                                value={line.inputMode === "allocation" ? line.allocation : line.quantity}
                                aria-label={line.inputMode === "allocation" ? "비중" : "매수 주식수"}
                                onChange={(event) => updateBuyLine(line.id,
                                  line.inputMode === "allocation"
                                    ? { allocation: Number(event.target.value) }
                                    : { quantity: Number(event.target.value) },
                                )} />
                            </div>
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

                  <div className="alloc-summary-row mt-4 flex items-center gap-3">
                    <div className="alloc-bar-track">
                      <div className="alloc-bar-fill"
                        style={{ width: `${Math.max(0, Math.min(allocationSum, 100))}%`, background: allocBarColor }} />
                    </div>
                    <span className="alloc-summary-text text-sm font-black tabular-nums" style={{ color: allocBarColor }}>
                      {allocationSum.toFixed(1)}%
                      {allocOver ? ` · 추가 현금 ${Math.max(0, allocationSum - 100).toFixed(1)}%` : cashAllocationPreview > 0 ? ` · 현금 ${cashAllocationPreview.toFixed(1)}%` : " ✓"}
                      {shareModeCount > 0 ? ` · 주식수 ${shareModeCount}줄` : ""}
                    </span>
                  </div>
                </section>

                <section className="manual-section action-section">
                  <button type="button" onClick={() => calculate("manual")} disabled={loading || manualFutureDate} className="calc-btn">
                    {loading ? "계산 중..." : "껄껄 계산하기"}
                  </button>
                </section>
              </div>
            </details>
          </div>

          {showManualNudge && result && (
            <div className="manual-nudge">
              <strong>질문만으로도 충분히 아프지만요.</strong>
              <span>직접 입력 모드를 열면 여러 매도 종목, 주식수 기준 매수, 추가 투입 현금까지 넣어서 당신의 잘못을... 아니 기회비용을 더 정교하게 파헤칠 수 있어요.</span>
            </div>
          )}

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
                  <p className="sub">
                    {result.soldResults.length > 1
                      ? `${result.soldResults.length}개 매도 종목 합산`
                      : `${result.soldResolvedSymbol} · ${result.soldMatchedDate}`}
                  </p>
                  {result.additionalCashBase > 0 && (
                    <p className="sub accent">
                      추가 투입 현금 {formatConvertedAmount(result.additionalCashBase, result.soldCurrency, displayCurrency, result.displayFxRate)} 별도 반영
                    </p>
                  )}
                </div>
                <div className="scenario-card hold">
                  <p className="label">지금까지 버텼다면?</p>
                  <p className="value">
                    {formatConvertedAmount(result.holdScenarioValue, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </p>
                  <p className="sub">수익률 {formatPercent(resultMetrics.holdReturnPct)} · {result.keepMatchedDate}</p>
                  {result.additionalCashBase > 0 && (
                    <p className="sub accent">초과 매수분은 현금으로 함께 보유한 기준입니다.</p>
                  )}
                </div>
                <div className="scenario-card switched">
                  <p className="label">{result.buyResults.length > 0 ? "혹시 갈아탔다면?" : "현금으로 뒀다면?"}</p>
                  <p className={`value ${vc.valueColor}`}>
                    {formatConvertedAmount(result.totalCurrentValue, result.soldCurrency, displayCurrency, result.displayFxRate)}
                  </p>
                  <p className="sub">
                    수익률 {formatPercent(resultMetrics.switchedReturnPct)}
                    {result.cashAllocation > 0 ? ` · 남은 현금 ${result.cashAllocation.toFixed(1)}%` : ""}
                    {result.additionalCashAllocation > 0 ? ` · 추가 현금 ${result.additionalCashAllocation.toFixed(1)}%` : ""}
                  </p>
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
                  <div className="detail-subtitle">매도한 종목</div>
                  {result.soldResults.map((line) => (
                    <div key={line.id} className="rounded-lg p-3"
                      style={{ border: "1.5px solid rgba(15,25,40,0.07)", background: "#F8FAFC" }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black" style={{ color: "var(--ink)" }}>{line.symbol}</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{line.quantity.toFixed(4)}주 매도</span>
                        {line.currency === "KRW" ? <span className="tag-krw">KRW</span> : <span className="tag-usd">USD</span>}
                        <span className="ml-auto text-sm font-black tabular-nums text-slate-700">
                          {formatConvertedAmount(line.soldProceedsBase, result.soldCurrency, displayCurrency, result.displayFxRate)}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                        <p>
                          매도 {formatAmount(line.sellPrice, line.currency)} ({line.matchedSellDate})
                          {line.fxAtSell !== 1 && ` · 환율 ₩${Math.round(line.fxAtSell).toLocaleString()}`}
                        </p>
                        <p>
                          보유했다면 {formatAmount(line.keepPrice, line.currency)} ({line.keepMatchedDate}) → {formatConvertedAmount(line.keepValueBase, result.soldCurrency, displayCurrency, result.displayFxRate)}
                          {line.fxAtEval !== 1 && ` · 평가 환율 ₩${Math.round(line.fxAtEval).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}

                  {result.buyResults.length > 0 && <div className="detail-subtitle with-gap">갈아탄 종목</div>}
                  {result.buyResults.map((line) => {
                    const pnl = line.currentValueBase - line.investedBase;
                    const isProfit = pnl >= 0;
                    const inputLabel = line.inputMode === "shares"
                      ? `${line.shares.toFixed(4)}주 입력`
                      : `${line.allocation.toFixed(1)}% 입력`;
                    return (
                      <div key={line.id} className="rounded-lg p-3"
                        style={{ border: "1.5px solid rgba(15,25,40,0.07)", background: "#F8FAFC" }}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black" style={{ color: "var(--ink)" }}>{line.symbol}</span>
                          <span className="text-xs" style={{ color: "var(--muted)" }}>({inputLabel})</span>
                          {line.currency === "KRW" ? <span className="tag-krw">KRW</span> : <span className="tag-usd">USD</span>}
                          <span className={`ml-auto text-sm font-black tabular-nums ${isProfit ? "text-emerald-600" : "text-red-600"}`}>
                            {isProfit ? "+" : ""}
                            {formatConvertedAmount(pnl, result.soldCurrency, displayCurrency, result.displayFxRate)}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                          <p>
                            투입 원금 {formatConvertedAmount(line.investedBase, result.soldCurrency, displayCurrency, result.displayFxRate)}
                          </p>
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
                  {result.additionalCashBase > 0 && (
                    <div className="rounded-lg p-3"
                      style={{ border: "1.5px solid rgba(249,115,22,0.28)", background: "#FFF7ED" }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black" style={{ color: "var(--ink)" }}>추가 투입 현금</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>매도금 초과 매수분</span>
                        <span className="ml-auto text-sm font-black tabular-nums text-orange-700">
                          {formatConvertedAmount(result.additionalCashBase, result.soldCurrency, displayCurrency, result.displayFxRate)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                        비교가 불공평해지지 않도록, 계속 보유/현금 보유 시나리오에도 같은 금액을 현금으로 더해 계산했습니다.
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
