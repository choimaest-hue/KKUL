import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const stockFilePath = fileURLToPath(new URL("../src/data/stocks.ts", import.meta.url));
const outputPath = fileURLToPath(new URL("../src/data/generatedStocks.ts", import.meta.url));

const S_AND_P_500_URL = "https://datahub.io/core/s-and-p-500-companies/r/constituents.csv";
const NAVER_MARKET_URL = "https://m.stock.naver.com/api/stocks/marketValue";

const EXTRA_US = [
  ["SPY", "SPDR S&P 500 ETF", ["ETF", "S&P500", "미국지수"]],
  ["QQQ", "Invesco QQQ Trust", ["ETF", "나스닥100", "NASDAQ100"]],
  ["VOO", "Vanguard S&P 500 ETF", ["ETF", "S&P500", "뱅가드"]],
  ["IVV", "iShares Core S&P 500 ETF", ["ETF", "S&P500", "iShares"]],
  ["VTI", "Vanguard Total Stock Market ETF", ["ETF", "미국전체", "뱅가드"]],
  ["DIA", "SPDR Dow Jones Industrial Average ETF", ["ETF", "다우", "Dow"]],
  ["IWM", "iShares Russell 2000 ETF", ["ETF", "러셀2000", "소형주"]],
  ["VT", "Vanguard Total World Stock ETF", ["ETF", "전세계", "글로벌"]],
  ["SCHD", "Schwab U.S. Dividend Equity ETF", ["ETF", "배당", "배당성장"]],
  ["VYM", "Vanguard High Dividend Yield ETF", ["ETF", "고배당", "배당"]],
  ["VIG", "Vanguard Dividend Appreciation ETF", ["ETF", "배당성장", "배당"]],
  ["JEPI", "JPMorgan Equity Premium Income ETF", ["ETF", "월배당", "커버드콜"]],
  ["JEPQ", "JPMorgan Nasdaq Equity Premium Income ETF", ["ETF", "월배당", "커버드콜", "나스닥"]],
  ["QLD", "ProShares Ultra QQQ", ["ETF", "나스닥", "2배", "레버리지"]],
  ["TQQQ", "ProShares UltraPro QQQ", ["ETF", "나스닥", "3배", "레버리지"]],
  ["SQQQ", "ProShares UltraPro Short QQQ", ["ETF", "나스닥", "인버스", "3배"]],
  ["SMH", "VanEck Semiconductor ETF", ["ETF", "반도체", "VanEck"]],
  ["SOXX", "iShares Semiconductor ETF", ["ETF", "반도체", "iShares"]],
  ["SOXL", "Direxion Daily Semiconductor Bull 3X Shares", ["ETF", "반도체", "3배", "레버리지"]],
  ["SOXS", "Direxion Daily Semiconductor Bear 3X Shares", ["ETF", "반도체", "인버스", "3배"]],
  ["XLK", "Technology Select Sector SPDR Fund", ["ETF", "기술주", "섹터"]],
  ["XLF", "Financial Select Sector SPDR Fund", ["ETF", "금융", "섹터"]],
  ["XLE", "Energy Select Sector SPDR Fund", ["ETF", "에너지", "섹터"]],
  ["XLY", "Consumer Discretionary Select Sector SPDR Fund", ["ETF", "임의소비재", "섹터"]],
  ["XLI", "Industrial Select Sector SPDR Fund", ["ETF", "산업재", "섹터"]],
  ["XLP", "Consumer Staples Select Sector SPDR Fund", ["ETF", "필수소비재", "섹터"]],
  ["XLV", "Health Care Select Sector SPDR Fund", ["ETF", "헬스케어", "섹터"]],
  ["XLU", "Utilities Select Sector SPDR Fund", ["ETF", "유틸리티", "섹터"]],
  ["XLB", "Materials Select Sector SPDR Fund", ["ETF", "소재", "섹터"]],
  ["XLRE", "Real Estate Select Sector SPDR Fund", ["ETF", "리츠", "부동산"]],
  ["GLD", "SPDR Gold Shares", ["ETF", "금", "원자재"]],
  ["SLV", "iShares Silver Trust", ["ETF", "은", "원자재"]],
  ["USO", "United States Oil Fund", ["ETF", "원유", "WTI"]],
  ["UNG", "United States Natural Gas Fund", ["ETF", "천연가스", "원자재"]],
  ["TLT", "iShares 20+ Year Treasury Bond ETF", ["ETF", "미국채", "장기채"]],
  ["IEF", "iShares 7-10 Year Treasury Bond ETF", ["ETF", "미국채", "중기채"]],
  ["SHY", "iShares 1-3 Year Treasury Bond ETF", ["ETF", "미국채", "단기채"]],
  ["BIL", "SPDR Bloomberg 1-3 Month T-Bill ETF", ["ETF", "미국채", "초단기채"]],
  ["HYG", "iShares iBoxx High Yield Corporate Bond ETF", ["ETF", "하이일드", "회사채"]],
  ["LQD", "iShares iBoxx Investment Grade Corporate Bond ETF", ["ETF", "회사채", "투자등급"]],
  ["IBIT", "iShares Bitcoin Trust ETF", ["ETF", "비트코인", "bitcoin", "BTC"]],
  ["FBTC", "Fidelity Wise Origin Bitcoin Fund", ["ETF", "비트코인", "bitcoin", "BTC"]],
  ["BITO", "ProShares Bitcoin Strategy ETF", ["ETF", "비트코인", "선물"]],
  ["ARKK", "ARK Innovation ETF", ["ETF", "아크", "혁신주"]],
  ["ARKW", "ARK Next Generation Internet ETF", ["ETF", "아크", "인터넷"]],
  ["ARKG", "ARK Genomic Revolution ETF", ["ETF", "아크", "유전체"]],
  ["ARKF", "ARK Fintech Innovation ETF", ["ETF", "아크", "핀테크"]],
  ["TAN", "Invesco Solar ETF", ["ETF", "태양광", "신재생"]],
  ["ICLN", "iShares Global Clean Energy ETF", ["ETF", "클린에너지", "신재생"]],
  ["BOTZ", "Global X Robotics & Artificial Intelligence ETF", ["ETF", "로봇", "AI"]],
  ["ROBO", "ROBO Global Robotics and Automation ETF", ["ETF", "로봇", "자동화"]],
  ["KWEB", "KraneShares CSI China Internet ETF", ["ETF", "중국인터넷", "중국주식"]],
  ["VGT", "Vanguard Information Technology ETF", ["ETF", "기술주", "뱅가드"]],
  ["VUG", "Vanguard Growth ETF", ["ETF", "성장주", "뱅가드"]],
  ["VTV", "Vanguard Value ETF", ["ETF", "가치주", "뱅가드"]],
];

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...records] = rows.filter((record) => record.some((value) => value.trim()));
  return records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])));
}

function normalizeUsSymbol(symbol) {
  return symbol.trim().replace(/\./g, "-").toUpperCase();
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isKoreanListing(stock) {
  const code = cleanText(stock.itemCode);
  const name = cleanText(stock.stockName);
  if (!/^\d{6}$/.test(code)) {
    return false;
  }
  if (stock.stockType !== "domestic") {
    return false;
  }
  if (stock.stockEndType !== "stock") {
    return false;
  }
  return !/스팩|기업인수/.test(name);
}

function toEntry({ symbol, nameKo, nameEn, market, tags }) {
  return {
    symbol: cleanText(symbol),
    nameKo: cleanText(nameKo),
    nameEn: cleanText(nameEn),
    market,
    tags: [...new Set(tags.map(cleanText).filter(Boolean))],
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/plain, text/csv, application/json, */*",
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function fetchSp500() {
  const csv = await fetchText(S_AND_P_500_URL);
  return parseCsv(csv).map((row) =>
    toEntry({
      symbol: normalizeUsSymbol(row.Symbol),
      nameKo: row.Security,
      nameEn: row.Security,
      market: "US",
      tags: [row["GICS Sector"], row["GICS Sub-Industry"]],
    }),
  );
}

async function fetchNaverMarket(category, market) {
  const entries = [];

  for (let page = 1; page <= 50; page += 1) {
    const payload = await fetchJson(`${NAVER_MARKET_URL}/${category}?page=${page}&pageSize=100`);
    const stocks = payload.stocks ?? [];
    if (!stocks.length) {
      break;
    }

    for (const stock of stocks) {
      if (!isKoreanListing(stock)) {
        continue;
      }

      entries.push(
        toEntry({
          symbol: stock.itemCode,
          nameKo: stock.stockName,
          nameEn: stock.stockName,
          market,
          tags: [],
        }),
      );
    }
  }

  return entries;
}

function chunkString(value, chunkSize = 12000) {
  const chunks = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

async function main() {
  const stockFile = await readFile(stockFilePath, "utf8");
  const curatedSymbols = new Set([...stockFile.matchAll(/symbol:\s*"([^"]+)"/g)].map((match) => match[1]));
  const generated = [];
  const seen = new Set(curatedSymbols);

  function add(entries) {
    for (const entry of entries) {
      if (!entry.symbol || seen.has(entry.symbol)) {
        continue;
      }
      seen.add(entry.symbol);
      generated.push(entry);
    }
  }

  add(EXTRA_US.map(([symbol, name, tags]) => toEntry({ symbol, nameKo: name, nameEn: name, market: "US", tags })));
  add(await fetchSp500());
  add(await fetchNaverMarket("KOSPI", "KS"));
  add(await fetchNaverMarket("KOSDAQ", "KQ"));

  const byMarket = generated.reduce((acc, entry) => {
    acc[entry.market] = (acc[entry.market] ?? 0) + 1;
    return acc;
  }, {});

  const generatedStockJson = JSON.stringify(generated);
  const content = `import type { Stock } from "./stocks";

const generatedStockJson = [
${chunkString(generatedStockJson).map((chunk) => `  ${JSON.stringify(chunk)},`).join("\n")}
].join("");

export const GENERATED_STOCKS = JSON.parse(generatedStockJson) as Stock[];
`;

  await writeFile(outputPath, content, "utf8");
  console.log(`generated ${generated.length} supplemental stocks`);
  console.log(JSON.stringify(byMarket));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
