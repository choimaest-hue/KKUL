"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type HistoryPoint = { date: string; close: number };

type Props = {
  history: HistoryPoint[];
  color: string;
  gradientId: string;
  decimals: number;
  label: string;
  suffix?: string;
  range: string;
};

function formatVal(v: number, decimals: number, suffix?: string): string {
  const formatted = v.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return suffix ? `${formatted}${suffix}` : formatted;
}

export default function IndexChart({ history, color, gradientId, decimals, label, suffix, range }: Props) {
  const minVal = Math.min(...history.map((h) => h.close));
  const maxVal = Math.max(...history.map((h) => h.close));
  const padding = (maxVal - minVal) * 0.08 || 1;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.18} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            if (range === "5y")
              return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
            return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
          }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          domain={[minVal - padding, maxVal + padding]}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          width={decimals === 0 ? 64 : 72}
          tickFormatter={(v: number) =>
            v.toLocaleString("ko-KR", { maximumFractionDigits: decimals })
          }
        />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
          formatter={(v) => [typeof v === "number" ? formatVal(v, decimals, suffix) : String(v), label]}
          labelFormatter={(l) => `날짜: ${String(l)}`}
        />
        <Area
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
