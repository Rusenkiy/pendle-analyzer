"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface StrategyDataPoint {
  timestamp: string; // Formatted date string (e.g. "YYYY-MM-DD HH:mm")
  ytPrice: number;   // YT/Underlying price
  fairValue: number; // Fair value curve price
  pointsEarned: number; // Cumulative or weighted points earned
}

export interface ResultsDashboardProps {
  data: StrategyDataPoint[];
  totalWeightedPoints: number;
  symbol: string;
  network: string;
  underlyingAmount: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

// Custom Tooltip component for Recharts styled brutalistically
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border-2 border-dark-border p-3 font-mono text-[11px] text-slate-300 rounded-none shadow-lg">
        <p className="text-brand-green font-bold mb-2 border-b border-dark-border pb-1">
          &gt; DATE: {label}
        </p>
        <div className="space-y-1">
          {payload.map((item) => (
            <p key={item.name} className="flex justify-between gap-4" style={{ color: item.color }}>
              <span>{item.name?.toUpperCase()}:</span>
              <span className="font-bold">{item.value !== undefined ? Number(item.value).toFixed(6) : "0.000000"}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ResultsDashboard({
  data,
  totalWeightedPoints,
  symbol,
  network,
  underlyingAmount,
}: ResultsDashboardProps) {
  // Extract latest metrics for display fallback
  const latestPrice = data.length > 0 ? data[data.length - 1].ytPrice : 0;
  const latestFairValue = data.length > 0 ? data[data.length - 1].fairValue : 0;
  const priceToFairGap = latestFairValue > 0 ? ((latestPrice - latestFairValue) / latestFairValue) * 100 : 0;

  return (
    <div className="border-2 border-dark-border bg-dark-card p-6 rounded-none w-full font-mono text-slate-200">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-border pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 bg-brand-green"></span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Simulation Results Console
            </span>
          </div>
          <h2 className="text-xl font-bold uppercase text-slate-100">
            {symbol} Strategy Run
          </h2>
        </div>
        <div className="text-left md:text-right text-xs text-slate-400">
          <p>NETWORK: {network.toUpperCase()}</p>
          <p>COLLATERAL: {underlyingAmount} Underlying</p>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: Total Points */}
        <div className="border border-dark-border bg-black p-4 rounded-none flex flex-col justify-between">
          <span className="text-[10px] text-brand-green font-bold tracking-wider">
            [STAT_01 // TOTAL_WEIGHTED_POINTS]
          </span>
          <div className="my-3">
            <span className="text-2xl md:text-3xl font-extrabold text-white">
              {totalWeightedPoints.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            CUMULATIVE EARNED POINTS
          </span>
        </div>

        {/* Card 2: Current YT Price */}
        <div className="border border-dark-border bg-black p-4 rounded-none flex flex-col justify-between">
          <span className="text-[10px] text-brand-green font-bold tracking-wider">
            [STAT_02 // LATEST_YT_PRICE]
          </span>
          <div className="my-3">
            <span className="text-2xl md:text-3xl font-extrabold text-white">
              {latestPrice.toFixed(6)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            YT / UNDERLYING RATIO
          </span>
        </div>

        {/* Card 3: Price vs Fair Value Gap */}
        <div className="border border-dark-border bg-black p-4 rounded-none flex flex-col justify-between">
          <span className="text-[10px] text-brand-green font-bold tracking-wider">
            [STAT_03 // PRICE_TO_FAIR_GAP]
          </span>
          <div className="my-3">
            <span
              className={`text-2xl md:text-3xl font-extrabold ${
                priceToFairGap <= 0 ? "text-brand-green" : "text-red-500"
              }`}
            >
              {priceToFairGap > 0 ? "+" : ""}
              {priceToFairGap.toFixed(2)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            {priceToFairGap <= 0 ? "UNDER FAIR VALUE (BUY)" : "OVER VALUED (HOLD)"}
          </span>
        </div>
      </div>

      {/* Strategy Guidance HUD banner */}
      <div className="border border-brand-green bg-brand-green-dim/10 text-brand-green p-3 text-xs mb-6 rounded-none flex items-start gap-3">
        <span className="font-bold shrink-0">&gt; NOTE:</span>
        <p className="leading-normal">
          Maximize point yields by purchasing Yield Tokens (YT) when the <strong className="underline">YT Price</strong> (green line) is <strong className="underline">under</strong> the <strong className="underline">Fair Value Curve</strong> (yellow dashed line).
        </p>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[400px] border border-dark-border bg-black p-4 rounded-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
            />
            {/* Left YAxis - YT Price and Fair Value */}
            <YAxis
              yAxisId="left"
              stroke="#00FF66"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
              domain={["auto", "auto"]}
              tickFormatter={(value: number) => value.toFixed(4)}
            />
            {/* Right YAxis - Points Earned */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#F8FAFC"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
              domain={["auto", "auto"]}
              tickFormatter={(value: number) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="rect"
              wrapperStyle={{
                fontFamily: "monospace",
                fontSize: "10px",
                textTransform: "uppercase",
              }}
            />
            {/* YT Price line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ytPrice"
              name="YT Price"
              stroke="#00FF66"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "#00FF66", strokeWidth: 2 }}
            />
            {/* Fair Value Curve line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="fairValue"
              name="Fair Value"
              stroke="#FBBF24"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: "#FBBF24", strokeWidth: 2 }}
            />
            {/* Points Earned line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pointsEarned"
              name="Points Earned"
              stroke="#F8FAFC"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "#F8FAFC", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
