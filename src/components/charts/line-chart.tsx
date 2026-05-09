"use client";

import * as React from "react";
import {
  LineChart,
  Line,
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

export interface LineChartWidgetProps {
  data: ChartDataPoint[];
  /** Label for the primary line */
  seriesLabel?: string;
  /** Label for the secondary line (uses value2) */
  series2Label?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisKey?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LineChartWidget({
  data,
  seriesLabel = "Value",
  series2Label,
  height = 240,
  showGrid = true,
  showLegend = false,
  xAxisKey = "label",
}: LineChartWidgetProps) {
  const hasSecondary = data.some((d) => d.value2 !== undefined);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey="value"
            name={seriesLabel}
            stroke={getChartColor(0)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: getChartColor(0) }}
          />
          {hasSecondary && series2Label && (
            <Line
              type="monotone"
              dataKey="value2"
              name={series2Label}
              stroke={getChartColor(1)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: getChartColor(1) }}
              strokeDasharray="4 2"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
