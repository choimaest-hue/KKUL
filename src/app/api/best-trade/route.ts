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
  };
};

type PricePoint = {
  date: string;
  timestamp: number;
  close: number;
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

function detectCurrency(resolvedSymbol: string): "USD" | "KRW" {
  if (resolvedSymbol.endsWith(".KS") || resolvedSymbol.endsWith(".KQ")) {
    return "KRW";
  }

  return "USD";
}

async function fetchDailyCloses(symbol: string, startDate: string, endDate: string) {
  const startUnix = toUnix(startDate);
  const endUnix = toUnix(endDate) + DAY_SECONDS;

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
  const points: PricePoint[] = [];

  for (let index = 0; index < timestamps.length; index += 1) {
    const timestamp = timestamps[index];
    const close = closes[index];

    if (typeof timestamp !== "number" || typeof close !== "number" || !Number.isFinite(close)) {
      continue;
    }

    const date = dateOnlyFromUnix(timestamp);
    if (date < startDate || date > endDate) {
      continue;
    }

    points.push({ date, timestamp, close });
  }

  return {
    resolvedSymbol: result.meta?.symbol ?? symbol,
    points: points.sort((left, right) => left.timestamp - right.timestamp),
  };
}

function findBestTrade(points: PricePoint[]) {
  if (points.length < 2) {
    return null;
  }

  let lowestPoint = points[0];
  let bestTrade = {
    buyDate: points[0].date,
    buyPrice: points[0].close,
    sellDate: points[1].date,
    sellPrice: points[1].close,
    returnPct: ((points[1].close - points[0].close) / points[0].close) * 100,
  };

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const returnPct = ((point.close - lowestPoint.close) / lowestPoint.close) * 100;

    if (returnPct > bestTrade.returnPct) {
      bestTrade = {
        buyDate: lowestPoint.date,
        buyPrice: lowestPoint.close,
        sellDate: point.date,
        sellPrice: point.close,
        returnPct,
      };
    }

    if (point.close < lowestPoint.close) {
      lowestPoint = point;
    }
  }

  return bestTrade;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "";
  const startDate = request.nextUrl.searchParams.get("start") ?? "";
  const endDate = request.nextUrl.searchParams.get("end") ?? "";

  if (!symbol || !startDate || !endDate) {
    return NextResponse.json(
      { message: "symbol, start, and end are required." },
      { status: 400 },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return NextResponse.json(
      { message: "start and end must be yyyy-mm-dd format." },
      { status: 400 },
    );
  }

  if (startDate >= endDate) {
    return NextResponse.json(
      { message: "end must be after start." },
      { status: 400 },
    );
  }

  const candidates = buildSymbolCandidates(symbol);
  if (!candidates.length) {
    return NextResponse.json({ message: "symbol is invalid." }, { status: 400 });
  }

  for (const candidate of candidates) {
    const history = await fetchDailyCloses(candidate, startDate, endDate);
    if (!history) {
      continue;
    }

    const bestTrade = findBestTrade(history.points);
    if (!bestTrade) {
      continue;
    }

    return NextResponse.json({
      requestedSymbol: symbol,
      resolvedSymbol: history.resolvedSymbol,
      currency: detectCurrency(history.resolvedSymbol),
      startDate,
      endDate,
      ...bestTrade,
      gainPerShare: bestTrade.sellPrice - bestTrade.buyPrice,
    });
  }

  return NextResponse.json(
    {
      message: "Not enough price history found in requested range.",
      requestedSymbol: symbol,
      startDate,
      endDate,
    },
    { status: 404 },
  );
}