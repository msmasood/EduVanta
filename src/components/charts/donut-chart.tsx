"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getChartColor } from "@/lib/dashboard";
import type { ChartDataPoint } from "@/types/dashboard";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface DonutChartWidgetProps {
  data: ChartDataPoint[];
  height?: number;
  showLegend?: boolean;
  /** Inner radius percentage. 0 = pie, >0 = donut. Defaults to 55. */
  innerRadius?: number;
  outerRadius?: number;
  /** Center label (e.g. total count) */
  centerLabel?: string;
  centerSubLabel?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DonutChartWidget({
  data,
  height = 240,
  showLegend = true,
  innerRadius = 55,
  outerRadius = 80,
  centerLabel,
  centerSubLabel,
}: DonutChartWidgetProps) {
  const cx = "50%";
  const cy = showLegend ? "45%" : "50%";

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            nameKey="label"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={entry.color ?? getChartColor(index)}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
          />

          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
          )}

          {/* Center label rendered via foreignObject alternative: SVG text approach */}
          {centerLabel && innerRadius > 0 && (
            <>
              {/* The text elements are rendered outside Pie via absolute overlay */}
            </>
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center label overlay using CSS absolute positioning */}
      {centerLabel && innerRadius > 0 && (
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
          style={{ top: showLegend ? "-12%" : "0" }}
        >
          <span className="font-heading text-xl font-semibold tabular-nums">
            {centerLabel}
          </span>
          {centerSubLabel && (
            <span className="text-[10px] text-muted-foreground">{centerSubLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
