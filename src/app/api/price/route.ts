import { NextRequest, NextResponse } from "next/server";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
      meta?: {
        symbol?: string;
      };
    }>;
    error?: {
      code?: string;
      description?: string;
    };
  };
};

const DAY_SECONDS = 60 * 60 * 24;

function toUnix(dateString: string): number {
  const date = new Date(`${dateString}T00:00:00Z`);
  return Math.floor(date.getTime() / 1000);
}

function dateOnlyFromUnix(unix: number): string {
  return new Date(unix * 1000).toISOString().slice(0, 10);
}

function buildSymbolCandidates(rawSymbol: string): string[] {
  const cleaned = rawSymbol.trim().toUpperCase();
  if (!cleaned) {
    return [];
  }

  if (/^\d{6}$/.test(cleaned)) {
    return [`${cleaned}.KS`, `${cleaned}.KQ`];
  }

  if (cleaned.endsWith(".KS") || cleaned.endsWith(".KQ")) {
    return [cleaned];
  }

  return [cleaned];
}

async function fetchCloseOnOrBeforeDate(
  symbol: string,
  targetDate: string,
): Promise<
  | {
      symbol: string;
      date: string;
      close: number;
    }
  | null
> {
  const targetUnix = toUnix(targetDate);
  const startUnix = targetUnix - DAY_SECONDS * 14;
  const endUnix = targetUnix + DAY_SECONDS;

  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
  url.searchParams.set("period1", String(startUnix));
  url.searchParams.set("period2", String(endUnix));
  url.searchParams.set("interval", "1d");

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as YahooChartResponse;
  const result = payload.chart?.result?.[0];
  if (!result) {
    return null;
  }

  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];

  let bestIndex = -1;
  let bestTimestamp = -1;

  for (let i = 0; i < timestamps.length; i += 1) {
    const ts = timestamps[i];
    const close = closes[i];

    if (typeof ts !== "number") {
      continue;
    }

    if (typeof close !== "number" || !Number.isFinite(close)) {
      continue;
    }

    if (ts <= targetUnix && ts > bestTimestamp) {
      bestTimestamp = ts;
      bestIndex = i;
    }
  }

  if (bestIndex === -1) {
    return null;
  }

  const matchedSymbol = result.meta?.symbol ?? symbol;
  const matchedClose = closes[bestIndex];

  if (typeof matchedClose !== "number") {
    return null;
  }

  return {
    symbol: matchedSymbol,
    date: dateOnlyFromUnix(timestamps[bestIndex]),
    close: matchedClose,
  };
}

function detectCurrency(resolvedSymbol: string): "USD" | "KRW" {
  if (resolvedSymbol.endsWith(".KS") || resolvedSymbol.endsWith(".KQ")) {
    return "KRW";
  }
  return "USD";
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "";
  const date = request.nextUrl.searchParams.get("date") ?? "";

  if (!symbol || !date) {
    return NextResponse.json(
      { message: "symbol and date are required." },
      { status: 400 },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { message: "date must be yyyy-mm-dd format." },
      { status: 400 },
    );
  }

  const candidates = buildSymbolCandidates(symbol);
  if (!candidates.length) {
    return NextResponse.json({ message: "symbol is invalid." }, { status: 400 });
  }

  for (const candidate of candidates) {
    const result = await fetchCloseOnOrBeforeDate(candidate, date);

    if (result) {
      return NextResponse.json({
        requestedSymbol: symbol,
        resolvedSymbol: result.symbol,
        requestedDate: date,
        matchedDate: result.date,
        close: result.close,
        currency: detectCurrency(result.symbol),
      });
    }
  }

  return NextResponse.json(
    {
      message: "No close price found near requested date.",
      requestedSymbol: symbol,
      requestedDate: date,
    },
    { status: 404 },
  );
}
