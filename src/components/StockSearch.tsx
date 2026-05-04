"use client";

import { useEffect, useRef, useState } from "react";
import { searchStocks } from "@/data/stocks";
import type { Stock } from "@/data/stocks";

const MARKET_BADGE: Record<Stock["market"], string> = {
  US: "bg-blue-100 text-blue-700",
  KS: "bg-rose-100 text-rose-700",
  KQ: "bg-violet-100 text-violet-700",
};

const MARKET_LABEL: Record<Stock["market"], string> = {
  US: "미국",
  KS: "KOSPI",
  KQ: "KOSDAQ",
};

type Props = {
  value: string;
  onChange: (symbol: string) => void;
  placeholder?: string;
  compact?: boolean;
};

export default function StockSearch({
  value,
  onChange,
  placeholder = "종목명 또는 심볼로 검색",
  compact = false,
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<Stock[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const runSearch = (q: string) => {
    const found = searchStocks(q);
    setResults(found);
    setOpen(found.length > 0);
    setActiveIdx(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setInputValue(q);
    onChange(q);
    if (q.trim().length > 0) {
      runSearch(q);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleFocus = () => {
    if (inputValue.trim().length > 0 && results.length > 0) {
      setOpen(true);
    }
  };

  const select = (stock: Stock) => {
    setInputValue(stock.symbol);
    onChange(stock.symbol);
    setOpen(false);
    setResults([]);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) {
      return text;
    }

    const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());

    if (idx === -1) {
      return text;
    }

    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-200 text-amber-900 rounded-sm px-0.5 font-bold not-italic">
          {text.slice(idx, idx + query.trim().length)}
        </mark>
        {text.slice(idx + query.trim().length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`stock-search-input form-input w-full pr-8 ${compact ? "compact-input" : ""}`}
        />
        {inputValue && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault();
              setInputValue("");
              onChange("");
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-lg leading-none"
            aria-label="지우기"
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 min-w-[260px] w-full max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(12,35,64,0.14)] py-1"
        >
          {results.map((stock, idx) => (
            <li
              key={stock.symbol}
              role="option"
              aria-selected={idx === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault();
                select(stock);
              }}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors ${
                idx === activeIdx ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <span
                className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold ${
                  MARKET_BADGE[stock.market]
                }`}
              >
                {MARKET_LABEL[stock.market]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="shrink-0 text-sm font-bold text-slate-900 tabular-nums tracking-wide">
                    {highlightMatch(stock.symbol, inputValue)}
                  </span>
                  <span className="min-w-0 truncate text-sm text-slate-700">
                    {highlightMatch(stock.nameKo, inputValue)}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-400 leading-tight">
                  {stock.nameEn}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
