import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const curatedPath = fileURLToPath(new URL("../src/data/stocks.ts", import.meta.url));
const generatedPath = fileURLToPath(new URL("../src/data/generatedStocks.ts", import.meta.url));

function parseGeneratedStockJson(source) {
  const match = source.match(/const generatedStockJson = \[([\s\S]*?)\]\.join\(""\);/);
  if (!match) {
    throw new Error("generatedStockJson declaration was not found.");
  }

  const json = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line.replace(/,$/, "")))
    .join("");

  return JSON.parse(json);
}

const curatedSource = await readFile(curatedPath, "utf8");
const generatedSource = await readFile(generatedPath, "utf8");

const curatedSymbols = [...curatedSource.matchAll(/symbol:\s*"([^"]+)"/g)].map((match) => match[1]);
const generatedStocks = parseGeneratedStockJson(generatedSource);
const generatedSymbols = generatedStocks.map((stock) => stock.symbol);
const allSymbols = [...curatedSymbols, ...generatedSymbols];
const uniqueSymbols = new Set(allSymbols);
const duplicates = [...uniqueSymbols].filter(
  (symbol) => allSymbols.indexOf(symbol) !== allSymbols.lastIndexOf(symbol),
);
const badSymbols = allSymbols.filter((symbol) => !/^(?:[A-Z0-9.-]+|\d{6})$/.test(symbol));
const invalidGenerated = generatedStocks.filter(
  (stock) =>
    typeof stock.symbol !== "string" ||
    typeof stock.nameKo !== "string" ||
    typeof stock.nameEn !== "string" ||
    !["US", "KS", "KQ"].includes(stock.market) ||
    !Array.isArray(stock.tags),
);

console.log(
  `curated=${curatedSymbols.length} generated=${generatedSymbols.length} total=${allSymbols.length} unique=${uniqueSymbols.size}`,
);
console.log(
  JSON.stringify(
    generatedStocks.reduce((acc, stock) => {
      acc[stock.market] = (acc[stock.market] ?? 0) + 1;
      return acc;
    }, {}),
  ),
);

if (duplicates.length || badSymbols.length || invalidGenerated.length) {
  console.error(
    JSON.stringify({
      duplicateCount: duplicates.length,
      duplicates: duplicates.slice(0, 20),
      badSymbolCount: badSymbols.length,
      badSymbols: badSymbols.slice(0, 20),
      invalidGeneratedCount: invalidGenerated.length,
    }),
  );
  process.exitCode = 1;
}
