"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// recharts SSR 충돌 방지 — dynamic import with ssr:false
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
  { symbol: "^KS11",    label: "코스피",    description: "한국 대표 지수",      decimals: 2 },
  { symbol: "^KQ11",    label: "코스닥",    description: "한국 성장기업",        decimals: 2 },
  { symbol: "^GSPC",    label: "S&P 500",   description: "미국 대형주 500",      decimals: 2 },
  { symbol: "^IXIC",    label: "나스닥",    description: "미국 기술주 종합",     decimals: 2 },
  { symbol: "^NDX",     label: "나스닥100", description: "나스닥 상위 100",      decimals: 2 },
  { symbol: "^DJI",     label: "다우존스",  description: "미국 30대 우량주",     decimals: 0 },
  { symbol: "^VIX",     label: "VIX",       description: "공포 지수 (변동성)",   decimals: 2 },
  { symbol: "USDKRW=X", label: "원/달러",   description: "USD/KRW 환율",         decimals: 0, suffix: "원" },
  { symbol: "DX=F",     label: "달러인덱스",description: "달러 강세 지수",       decimals: 3 },
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
  description: string;
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

function fmtVal(v: number, decimals: number, suffix?: string): string {
  const s = v.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return suffix ? `${s}${suffix}` : s;
}

function ChangeChip({ change, changePct, small }: { change: number; changePct: number; small?: boolean }) {
  const up = change >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full font-bold tabular-nums ${
      small ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-xs"
    } ${up ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"}`}>
      {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}%
    </span>
  );
}

/* ── 상세 차트 모달 ──────────────────────────────────────── */
function DetailModal({ data, onClose }: { data: DetailData; onClose: () => void }) {
  const [range, setRange] = useState<RangeKey>("1m");
  const [history, setHistory] = useState<HistoryPoint[]>(data.history);
  const [loadingRange, setLoadingRange] = useState(false);
  const [rangeError, setRangeError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const loadRange = useCallback(async (r: RangeKey) => {
    if (r === "1m") { setHistory(data.history); setRangeError(false); return; }
    setLoadingRange(true); setRangeError(false);
    try {
      const res = await fetch(`/api/indices?symbol=${encodeURIComponent(data.symbol)}&range=${r}`);
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as { history: HistoryPoint[] };
      if (!json.history?.length) throw new Error("empty");
      setHistory(json.history);
    } catch { setRangeError(true); }
    finally { setLoadingRange(false); }
  }, [data.symbol, data.history]);

  useEffect(() => { loadRange(range); }, [range, loadRange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const up = data.change >= 0;
  const color = up ? "#e11d48" : "#2563eb";
  const gradientId = `grad-${data.symbol.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 pt-5 pb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{data.description}</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{data.label}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <p className="text-3xl font-black tabular-nums text-slate-900">
                {fmtVal(data.current, data.decimals, data.suffix)}
              </p>
              <div className="flex items-center gap-1.5">
                <ChangeChip change={data.change} changePct={data.changePct} />
                <span className={`text-sm font-semibold tabular-nums ${up ? "text-rose-600" : "text-blue-600"}`}>
                  {up ? "+" : ""}{fmtVal(data.change, data.decimals, data.suffix)}
                </span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="mt-1 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-lg leading-none">
            ✕
          </button>
        </div>

        {/* 기간 탭 */}
        <div className="flex gap-1.5 px-6 pt-4">
          {RANGES.map((r) => (
            <button key={r.key} type="button" onClick={() => setRange(r.key)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                range === r.key ? "bg-[#18a78f] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              {r.label}
            </button>
          ))}
        </div>

        {/* 차트 */}
        <div className="relative px-4 pt-3 pb-5">
          {loadingRange && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80">
              <span className="text-sm font-bold text-slate-400">로딩 중…</span>
            </div>
          )}
          {rangeError ? (
            <div className="flex h-[260px] items-center justify-center">
              <p className="text-sm text-slate-400">데이터를 불러오지 못했습니다.</p>
            </div>
          ) : history.length > 0 ? (
            <IndexChart history={history} color={color} gradientId={gradientId}
              decimals={data.decimals} label={data.label} suffix={data.suffix} range={range} />
          ) : (
            <div className="h-[260px] w-full animate-pulse rounded-xl bg-slate-100" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 (하단 고정 바) ────────────────────────── */
export default function MarketIndices() {
  const [summaries, setSummaries] = useState<Record<string, IndexSummary>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchAll = useCallback(() => {
    setLoading(true);
    let done = 0;
    const total = INDICES.length;

    INDICES.forEach(async (def) => {
      try {
        const res = await fetch(`/api/indices?symbol=${encodeURIComponent(def.symbol)}&range=1m`);
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as IndexSummary & { history: HistoryPoint[]; error?: string };
        if (json.error) throw new Error(json.error);
        setSummaries((prev) => ({
          ...prev,
          [def.symbol]: { symbol: json.symbol ?? def.symbol, current: json.current ?? 0, change: json.change ?? 0, changePct: json.changePct ?? 0 },
        }));
      } catch {
        setSummaries((prev) => ({
          ...prev,
          [def.symbol]: { symbol: def.symbol, current: 0, change: 0, changePct: 0, error: true },
        }));
      } finally {
        done += 1;
        if (done === total) setLoading(false);
      }
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openDetail = async (def: IndexDef) => {
    const s = summaries[def.symbol];
    if (!s || s.error || loadingDetail) return;
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/indices?symbol=${encodeURIComponent(def.symbol)}&range=1m`);
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as IndexSummary & { history: HistoryPoint[] };
      setDetail({
        symbol: def.symbol, label: def.label, description: def.description,
        history: json.history ?? [],
        current: json.current ?? s.current,
        change: json.change ?? s.change,
        changePct: json.changePct ?? s.changePct,
        decimals: def.decimals, suffix: def.suffix,
      });
    } catch { /* 조용히 무시 */ }
    finally { setLoadingDetail(false); }
  };

  /* ── 축소 상태: 얇은 티커 바 ── */
  const tickerContent = (
    <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
      {INDICES.map((def) => {
        const s = summaries[def.symbol];
        const up = s ? s.change >= 0 : true;
        return (
          <button
            key={def.symbol}
            type="button"
            onClick={() => openDetail(def)}
            disabled={!s || s.error}
            className="flex shrink-0 cursor-pointer items-center gap-2 border-r border-slate-200 px-3 py-1.5 transition-colors hover:bg-slate-100 disabled:cursor-default"
          >
            <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap">{def.label}</span>
            {loading && !s ? (
              <span className="h-3 w-12 animate-pulse rounded bg-slate-200" />
            ) : s?.error ? (
              <span className="text-[10px] text-slate-400">-</span>
            ) : s ? (
              <>
                <span className="text-xs font-bold tabular-nums text-slate-700 whitespace-nowrap">
                  {fmtVal(s.current, def.decimals, def.suffix)}
                </span>
                <span className={`text-[10px] font-bold tabular-nums whitespace-nowrap ${up ? "text-rose-600" : "text-blue-600"}`}>
                  {up ? "▲" : "▼"}{Math.abs(s.changePct).toFixed(2)}%
                </span>
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  /* ── 확장 상태: 카드 그리드 ── */
  const cardGrid = (
    <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-5 lg:grid-cols-9">
      {INDICES.map((def) => {
        const s = summaries[def.symbol];
        const up = s ? s.change >= 0 : true;
        return (
          <button
            key={def.symbol}
            type="button"
            onClick={() => openDetail(def)}
            disabled={!s || s.error}
            className="group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/90 p-2.5 text-left transition-all hover:border-[#18a78f] hover:shadow-md active:scale-[0.97] disabled:cursor-default disabled:opacity-60"
          >
            <span className="text-[10px] font-bold text-slate-400 leading-tight truncate w-full">{def.description}</span>
            <span className="text-xs font-extrabold text-slate-900 group-hover:text-[#18a78f] whitespace-nowrap">{def.label}</span>
            {loading && !s ? (
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            ) : s?.error ? (
              <span className="text-xs text-slate-400">-</span>
            ) : s ? (
              <>
                <span className="text-sm font-black tabular-nums text-slate-800 leading-tight whitespace-nowrap">
                  {fmtVal(s.current, def.decimals, def.suffix)}
                </span>
                <span className={`text-[10px] font-bold tabular-nums ${up ? "text-rose-600" : "text-blue-600"}`}>
                  {up ? "▲" : "▼"}{Math.abs(s.changePct).toFixed(2)}%
                </span>
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] backdrop-blur">
        {/* 헤더 행 */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-[#18a78f] uppercase tracking-widest">LIVE</span>
            <span className="text-xs font-extrabold text-slate-700">주요 시장 지수</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-px text-[10px] font-bold text-slate-400">Yahoo Finance</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={fetchAll}
              disabled={loading}
              className="rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              {loading ? "⟳" : "⟳ 새로고침"}
            </button>
            <button
              type="button"
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
            >
              {expanded ? "▼ 접기" : "▲ 펼치기"}
            </button>
          </div>
        </div>

        {/* 확장 카드 그리드 */}
        {expanded && cardGrid}

        {/* 티커 바 (항상 표시) */}
        {tickerContent}
      </div>

      {/* 모달 */}
      {detail && <DetailModal data={detail} onClose={() => setDetail(null)} />}
    </>
  );
}
