"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// recharts를 dynamic import (SSR 비활성화) — App Router SSR과의 충돌 방지
const IndexChart = dynamic(() => import("./IndexChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center">
      <span className="text-sm text-slate-400">차트 로딩 중…</span>
    </div>
  ),
});

type IndexDef = {
  symbol: string;
  label: string;
  description: string;
  decimals: number;
  suffix?: string;
};

const INDICES: IndexDef[] = [
  { symbol: "^GSPC",    label: "S&P 500",    description: "미국 대형주 500",     decimals: 2 },
  { symbol: "^IXIC",    label: "나스닥",      description: "미국 기술주 종합",    decimals: 2 },
  { symbol: "^NDX",     label: "나스닥 100",  description: "나스닥 상위 100",     decimals: 2 },
  { symbol: "^DJI",     label: "다우존스",    description: "미국 30대 우량주",    decimals: 0 },
  { symbol: "^KS11",    label: "코스피",      description: "한국 주식시장 대표",  decimals: 2 },
  { symbol: "^KQ11",    label: "코스닥",      description: "한국 성장기업 시장",  decimals: 2 },
  { symbol: "^VIX",     label: "VIX",         description: "공포 지수 (변동성)",  decimals: 2 },
  { symbol: "USDKRW=X", label: "원/달러",     description: "USD/KRW 환율",        decimals: 0, suffix: "원" },
];

type IndexSummary = {
  symbol: string;
  current: number;
  change: number;
  changePct: number;
  error?: boolean;
};

type HistoryPoint = { date: string; close: number };

type DetailData = {
  symbol: string;
  label: string;
  history: HistoryPoint[];
  current: number;
  change: number;
  changePct: number;
  decimals: number;
  suffix?: string;
};

const RANGES = [
  { key: "1m", label: "1개월" },
  { key: "3m", label: "3개월" },
  { key: "6m", label: "6개월" },
  { key: "1y", label: "1년" },
  { key: "5y", label: "5년" },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

function formatVal(v: number, decimals: number, suffix?: string): string {
  const formatted = v.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return suffix ? `${formatted}${suffix}` : formatted;
}

function ChangeChip({ change, changePct }: { change: number; changePct: number }) {
  const up = change >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
        up ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}%
    </span>
  );
}

function IndexCard({
  def,
  summary,
  loading,
  onClick,
}: {
  def: IndexDef;
  summary?: IndexSummary;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white/90 p-3.5 text-left shadow-sm transition-all hover:border-[#18a78f] hover:shadow-[0_4px_18px_rgba(24,167,143,0.18)] active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-xs font-bold text-slate-400 leading-tight">{def.description}</span>
        {summary && !summary.error && (
          <ChangeChip change={summary.change} changePct={summary.changePct} />
        )}
      </div>

      <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#18a78f]">
        {def.label}
      </p>

      {loading ? (
        <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
      ) : summary?.error ? (
        <p className="text-sm font-bold text-slate-400">데이터 없음</p>
      ) : summary ? (
        <>
          <p className="text-lg font-black tabular-nums text-slate-800 leading-tight">
            {formatVal(summary.current, def.decimals, def.suffix)}
          </p>
          <p
            className={`text-xs font-semibold tabular-nums ${
              summary.change >= 0 ? "text-rose-600" : "text-blue-600"
            }`}
          >
            {summary.change >= 0 ? "+" : ""}
            {formatVal(summary.change, def.decimals, def.suffix)}
          </p>
        </>
      ) : (
        <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
      )}
    </button>
  );
}

function DetailModal({
  data,
  onClose,
}: {
  data: DetailData;
  onClose: () => void;
}) {
  const [range, setRange] = useState<RangeKey>("1m");
  const [history, setHistory] = useState<HistoryPoint[]>(data.history);
  const [loadingRange, setLoadingRange] = useState(false);
  const [rangeError, setRangeError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const loadRange = useCallback(
    async (r: RangeKey) => {
      if (r === "1m") {
        setHistory(data.history);
        setRangeError(false);
        return;
      }
      setLoadingRange(true);
      setRangeError(false);
      try {
        const res = await fetch(
          `/api/indices?symbol=${encodeURIComponent(data.symbol)}&range=${r}`,
        );
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as { history: HistoryPoint[] };
        if (!json.history?.length) throw new Error("empty");
        setHistory(json.history);
      } catch {
        setRangeError(true);
      } finally {
        setLoadingRange(false);
      }
    },
    [data.symbol, data.history],
  );

  useEffect(() => {
    loadRange(range);
  }, [range, loadRange]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const up = data.change >= 0;
  const color = up ? "#e11d48" : "#2563eb";
  const gradientId = `grad-${data.symbol.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 pt-5 pb-4">
          <div>
            <p className="text-sm text-slate-500">{data.label}</p>
            <p className="text-3xl font-black tabular-nums text-slate-900">
              {formatVal(data.current, data.decimals, data.suffix)}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <ChangeChip change={data.change} changePct={data.changePct} />
              <span
                className={`text-sm font-semibold tabular-nums ${
                  up ? "text-rose-600" : "text-blue-600"
                }`}
              >
                {up ? "+" : ""}
                {formatVal(data.change, data.decimals, data.suffix)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1.5 px-6 pt-4">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                range === r.key
                  ? "bg-[#18a78f] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="relative px-4 pt-3 pb-5">
          {loadingRange && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70">
              <span className="text-sm font-bold text-slate-400">로딩 중…</span>
            </div>
          )}
          {rangeError ? (
            <div className="flex h-[260px] items-center justify-center">
              <p className="text-sm text-slate-400">데이터를 불러오지 못했습니다.</p>
            </div>
          ) : history.length > 0 ? (
            <IndexChart
              history={history}
              color={color}
              gradientId={gradientId}
              decimals={data.decimals}
              label={data.label}
              suffix={data.suffix}
              range={range}
            />
          ) : (
            <div className="h-[260px] w-full animate-pulse rounded-xl bg-slate-100" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketIndices() {
  const [summaries, setSummaries] = useState<Record<string, IndexSummary>>({});
  const [globalLoading, setGlobalLoading] = useState(true);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchAll = useCallback(() => {
    setGlobalLoading(true);
    let completed = 0;
    const total = INDICES.length;

    INDICES.forEach(async (def) => {
      try {
        const res = await fetch(
          `/api/indices?symbol=${encodeURIComponent(def.symbol)}&range=1m`,
        );
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as IndexSummary & {
          history: HistoryPoint[];
          error?: string;
        };
        if (json.error) throw new Error(json.error);
        setSummaries((prev) => ({
          ...prev,
          [def.symbol]: {
            symbol: json.symbol ?? def.symbol,
            current: json.current ?? 0,
            change: json.change ?? 0,
            changePct: json.changePct ?? 0,
          },
        }));
      } catch {
        setSummaries((prev) => ({
          ...prev,
          [def.symbol]: {
            symbol: def.symbol,
            current: 0,
            change: 0,
            changePct: 0,
            error: true,
          },
        }));
      } finally {
        completed += 1;
        if (completed === total) setGlobalLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openDetail = async (def: IndexDef) => {
    const summary = summaries[def.symbol];
    if (summary?.error) return;
    setLoadingDetail(true);
    try {
      const res = await fetch(
        `/api/indices?symbol=${encodeURIComponent(def.symbol)}&range=1m`,
      );
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as IndexSummary & { history: HistoryPoint[] };
      setDetail({
        symbol: def.symbol,
        label: def.label,
        history: json.history ?? [],
        current: json.current ?? summary?.current ?? 0,
        change: json.change ?? summary?.change ?? 0,
        changePct: json.changePct ?? summary?.changePct ?? 0,
        decimals: def.decimals,
        suffix: def.suffix,
      });
    } catch {
      // 조용히 무시
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-900/10 bg-white/80 p-4 shadow-[0_18px_40px_rgba(12,35,64,0.07)] backdrop-blur md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">주요 시장 지수</h2>
            <p className="text-sm text-slate-500">카드를 클릭하면 상세 차트를 볼 수 있습니다</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
              Yahoo Finance
            </span>
            <button
              type="button"
              onClick={fetchAll}
              disabled={globalLoading}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            >
              {globalLoading ? "⟳ 로딩 중" : "⟳ 새로고침"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {INDICES.map((def) => (
            <IndexCard
              key={def.symbol}
              def={def}
              summary={summaries[def.symbol]}
              loading={globalLoading && !summaries[def.symbol]}
              onClick={() => {
                if (!loadingDetail) openDetail(def);
              }}
            />
          ))}
        </div>

        {loadingDetail && (
          <p className="mt-4 text-center text-sm font-bold text-[#18a78f]">
            차트 불러오는 중…
          </p>
        )}
      </div>

      {detail && <DetailModal data={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}
