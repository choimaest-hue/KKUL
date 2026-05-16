import { NextRequest, NextResponse } from "next/server";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      meta?: {
        symbol?: string;
        regularMarketPrice?: number;
        previousClose?: number;
        currency?: string;
      };
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
          open?: Array<number | null>;
        }>;
      };
    }>;
    error?: { code?: string; description?: string };
  };
};

type RangeConfig = {
  interval: string;
  daysBack: number;
};

const RANGE_CONFIG: Record<string, RangeConfig> = {
  "1m": { interval: "1d", daysBack: 31 },
  "3m": { interval: "1d", daysBack: 93 },
  "6m": { interval: "1d", daysBack: 186 },
  "1y": { interval: "1wk", daysBack: 365 },
  "5y": { interval: "1mo", daysBack: 1825 },
};
const YAHOO_HOSTS = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
const YAHOO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://finance.yahoo.com",
  Origin: "https://finance.yahoo.com",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol");
  const range = searchParams.get("range") ?? "1m";

  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  const config = RANGE_CONFIG[range] ?? RANGE_CONFIG["1m"];
  const now = Math.floor(Date.now() / 1000);
  const period1 = now - config.daysBack * 86400;
  const period2 = now + 86400;

  let payload: YahooChartResponse | null = null;

  for (const host of YAHOO_HOSTS) {
    const url = new URL(`https://${host}/v8/finance/chart/${encodeURIComponent(symbol)}`);
    url.searchParams.set("period1", String(period1));
    url.searchParams.set("period2", String(period2));
    url.searchParams.set("interval", config.interval);

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: YAHOO_HEADERS,
    });

    if (!response.ok) {
      continue;
    }

    payload = (await response.json()) as YahooChartResponse;
    if (payload.chart?.result?.[0]) {
      break;
    }
  }

  if (!payload) {
    return NextResponse.json({ error: "Yahoo Finance fetch failed" }, { status: 502 });
  }

  const result = payload.chart?.result?.[0];

  if (!result) {
    return NextResponse.json({ error: "No data returned" }, { status: 404 });
  }

  const meta = result.meta ?? {};
  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];

  const history: { date: string; close: number }[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];
    const close = closes[i];
    if (typeof ts === "number" && typeof close === "number" && isFinite(close)) {
      history.push({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        close: Math.round(close * 100) / 100,
      });
    }
  }

  const current = meta.regularMarketPrice ?? history[history.length - 1]?.close ?? 0;
  const prevClose = meta.previousClose ?? history[history.length - 2]?.close ?? current;
  const change = Math.round((current - prevClose) * 100) / 100;
  const changePct = prevClose !== 0 ? Math.round((change / prevClose) * 10000) / 100 : 0;

  return NextResponse.json({
    symbol: meta.symbol ?? symbol,
    currency: meta.currency ?? "USD",
    current,
    prevClose,
    change,
    changePct,
    history,
  });
}
