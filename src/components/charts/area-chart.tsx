"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getChartColor } from "@/lib/dashboard";
import type { ChartDataPoint } from "@/types/dashboard";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AreaChartWidgetProps {
  data: ChartDataPoint[];
  seriesLabel?: string;
  series2Label?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  /** Whether to stack the areas */
  stacked?: boolean;
  xAxisKey?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AreaChartWidget({
  data,
  seriesLabel = "Value",
  series2Label,
  height = 240,
  showGrid = true,
  showLegend = false,
  stacked = false,
  xAxisKey = "label",
}: AreaChartWidgetProps) {
  const hasSecondary = data.some((d) => d.value2 !== undefined);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="chart-area-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getChartColor(0)} stopOpacity={0.25} />
              <stop offset="95%" stopColor={getChartColor(0)} stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="chart-area-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getChartColor(1)} stopOpacity={0.25} />
              <stop offset="95%" stopColor={getChartColor(1)} stopOpacity={0.03} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}

          <Area
            type="monotone"
            dataKey="value"
            name={seriesLabel}
            stroke={getChartColor(0)}
            strokeWidth={2}
            fill="url(#chart-area-1)"
            stackId={stacked ? "a" : undefined}
          />
          {hasSecondary && series2Label && (
            <Area
              type="monotone"
              dataKey="value2"
              name={series2Label}
              stroke={getChartColor(1)}
              strokeWidth={2}
              fill="url(#chart-area-2)"
              stackId={stacked ? "a" : undefined}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
