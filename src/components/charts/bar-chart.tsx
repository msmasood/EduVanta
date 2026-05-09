"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { getChartColor } from "@/lib/dashboard";
import type { ChartDataPoint } from "@/types/dashboard";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface BarChartWidgetProps {
  data: ChartDataPoint[];
  seriesLabel?: string;
  series2Label?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  /** Orientation: "vertical" = vertical bars (default), "horizontal" = horizontal bars */
  orientation?: "vertical" | "horizontal";
  /** Use per-bar colors from data.color or cycling chart palette */
  multiColor?: boolean;
  xAxisKey?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BarChartWidget({
  data,
  seriesLabel = "Value",
  series2Label,
  height = 240,
  showGrid = true,
  showLegend = false,
  orientation = "vertical",
  multiColor = false,
  xAxisKey = "label",
}: BarChartWidgetProps) {
  const hasSecondary = data.some((d) => d.value2 !== undefined);
  const isHorizontal = orientation === "horizontal";

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 4, right: 8, left: isHorizontal ? 56 : -16, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              horizontal={!isHorizontal}
              vertical={isHorizontal}
            />
          )}
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
            </>
          ) : (
            <>
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
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}

          <Bar
            dataKey="value"
            name={seriesLabel}
            fill={multiColor ? getChartColor(0) : getChartColor(0)}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          >
            {multiColor &&
              data.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={entry.color ?? getChartColor(index)}
                />
              ))}
          </Bar>

          {hasSecondary && series2Label && (
            <Bar
              dataKey="value2"
              name={series2Label}
              fill={getChartColor(1)}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
